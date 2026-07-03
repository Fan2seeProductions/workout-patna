// /api/cron/daily-motivation — Daily cron (20:00 UTC / 3 PM CT, the afternoon
// slump). Sends one motivational quote as a push notification to every member
// with an active push subscription.
//
// The quote is picked deterministically per calendar day (lib/push/motivation),
// so re-runs send the same quote and the `tag` collapses duplicates in the
// notification tray.
//
// Like the Stripe webhook, this is a server-to-server call with no user
// session, so reading every row of push_subscriptions past RLS requires the
// service-role key. We do not fall back to the anon key — that would silently
// return zero rows.
//
// Secured with CRON_SECRET so only Vercel's scheduler can trigger it.

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { sendPush, type PushSubscription } from '../../../../lib/push/send'
import { quoteForDay, formatQuoteBody } from '../../../../lib/push/motivation'

export const runtime = 'nodejs'
export const maxDuration = 60

const BATCH_SIZE = 50   // concurrent pushes per batch

export async function GET(request: Request) {
  // ── Auth ──────────────────────────────────────────────────────────
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    console.error('[cron/daily-motivation] SUPABASE_SERVICE_ROLE_KEY is not set — cannot read subscriptions.')
    return NextResponse.json(
      { error: 'Subscription store not configured (missing service role key).' },
      { status: 500 },
    )
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { cookies: { getAll: () => [], setAll: () => {} } },
  )

  // ── Today's quote ─────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10)   // YYYY-MM-DD
  const quote = quoteForDay(today)
  const payload = {
    title: '🔥 Daily Motivation',
    body: formatQuoteBody(quote),
    url: '/app/coach',
    tag: `motivation-${today}`,
  }

  // ── Fetch every push subscription ─────────────────────────────────
  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')

  if (error) {
    console.error('[cron/daily-motivation] DB error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!subs?.length) {
    return NextResponse.json({ sent: 0, message: 'No push subscriptions' })
  }

  // ── Send in batches ───────────────────────────────────────────────
  let sent = 0
  let failedCount = 0

  for (let i = 0; i < subs.length; i += BATCH_SIZE) {
    const batch = subs.slice(i, i + BATCH_SIZE) as PushSubscription[]
    const results = await Promise.allSettled(batch.map(s => sendPush(s, payload)))
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) sent++
      else failedCount++
    }
  }

  console.log(`[cron/daily-motivation] ${today} — sent ${sent}/${subs.length} (quote: "${quote.text.slice(0, 40)}…")`)
  return NextResponse.json({ sent, failed: failedCount, total: subs.length, day: today })
}
