// /api/cron/intake-nudge — Daily cron job (runs at 10 AM UTC / 5 AM CT).
// Finds members who signed up 24+ hours ago, haven't submitted the AI Coach
// intake form, and haven't been nudged yet. Sends one reminder email each.
//
// Secured with CRON_SECRET so only Vercel's cron scheduler can call it.

import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { sendIntakeNudgeEmail } from '../../../../lib/email/intake-nudge'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: Request) {
  // Verify Vercel cron secret
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  // Find members who:
  // 1. Signed up more than 24 hours ago
  // 2. Have NOT submitted the intake form
  // 3. Have NOT already been nudged
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, display_name, first_name, intake_nudge_sent_at, created_at')
    .lt('created_at', cutoff)
    .is('intake_nudge_sent_at', null)

  if (error) {
    console.error('[cron/intake-nudge] DB error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!profiles?.length) {
    return NextResponse.json({ sent: 0, message: 'No eligible members' })
  }

  // Filter out anyone who has already submitted the intake
  const { data: intakes } = await supabase
    .from('ai_coach_intake')
    .select('user_id')
    .in('user_id', profiles.map(p => p.id))

  const hasIntake = new Set((intakes ?? []).map(i => i.user_id))
  const eligible = profiles.filter(p => !hasIntake.has(p.id))

  if (!eligible.length) {
    return NextResponse.json({ sent: 0, message: 'All have submitted intake' })
  }

  // Get emails from auth.users via admin RPC
  const { data: authUsers } = await supabase
    .rpc('admin_get_auth_users')
    .select('*')

  const emailMap = new Map<string, string>()
  if (authUsers) {
    for (const u of authUsers as Array<{ id: string; email: string }>) {
      emailMap.set(u.id, u.email)
    }
  }

  let sent = 0
  const now = new Date().toISOString()

  for (const profile of eligible) {
    const email = emailMap.get(profile.id)
    if (!email) continue

    const firstName =
      (profile.first_name as string | null) ??
      (profile.display_name as string | null)?.split(/\s+/)[0] ??
      null

    await sendIntakeNudgeEmail({ toEmail: email, firstName })

    // Stamp so we never send twice
    await supabase
      .from('profiles')
      .update({ intake_nudge_sent_at: now })
      .eq('id', profile.id)

    sent++
    console.log(`[cron/intake-nudge] Sent to ${email}`)
  }

  return NextResponse.json({ sent, eligible: eligible.length })
}
