// /api/cron/intake-reminders — Daily cron (runs at 10 AM UTC / 5 AM CT).
// Handles Day-3 and Day-7 follow-up emails for members who haven't
// completed their AI Coach intake form.
//
// Day-3 targets two groups separately:
//   A) Started intake but never accepted the disclaimer ("90% done" message)
//   B) Never touched the intake form (second gentle push)
//
// Day-7 targets anyone still incomplete — final automated email, softer tone.
// After Day-7 we stop automated emails; personal outreach is more appropriate.
//
// Secured with CRON_SECRET so only Vercel's cron scheduler can call it.

import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../lib/supabase/admin'
import { sendIntakeReminderD3Email } from '../../../../lib/email/intake-reminder-d3'
import { sendIntakeReminderD7Email } from '../../../../lib/email/intake-reminder-d7'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Service-role client: admin_get_auth_users is REVOKE'd from anon +
  // authenticated, and a cron has no user session (RLS would hide every row).
  const supabase = createAdminClient()
  if (!supabase) {
    console.error('[cron/intake-reminders] SUPABASE_SERVICE_ROLE_KEY not set — cannot run.')
    return NextResponse.json({ error: 'Service role key not configured.' }, { status: 500 })
  }
  const now = new Date()
  const d3Cutoff = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()  // 72 hrs ago
  const d7Cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()  // 7 days ago
  const d8Cutoff = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString()  // 8 days ago (upper bound for day-7)

  // ── Get emails from auth.users ──────────────────────────────────────
  const { data: authUsers } = await supabase.rpc('admin_get_auth_users').select('*')
  const emailMap = new Map<string, string>()
  if (authUsers) {
    for (const u of authUsers as Array<{ id: string; email: string }>) {
      emailMap.set(u.id, u.email)
    }
  }

  // ── Get all incomplete intake members with their stamp state ────────
  // Profiles signed up in the relevant windows who haven't finished intake
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, display_name, first_name, created_at, intake_nudge_sent_at, intake_reminder_d3_sent_at, intake_reminder_d7_sent_at')
    .lt('created_at', d3Cutoff)           // at least 3 days old
    .neq('id', '00000000-0000-0000-0000-000000000001')  // exclude bot

  if (error) {
    console.error('[cron/intake-reminders] DB error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!profiles?.length) {
    return NextResponse.json({ d3: 0, d7: 0, message: 'No eligible profiles' })
  }

  // Get IDs of members who have COMPLETED intake (disclaimer accepted)
  const { data: completedIntakes } = await supabase
    .from('ai_coach_intake')
    .select('user_id')
    .eq('disclaimer_accepted', true)
    .in('user_id', profiles.map(p => p.id))

  const completed = new Set((completedIntakes ?? []).map(i => i.user_id))

  // Get IDs of members who STARTED but didn't finish
  const { data: startedIntakes } = await supabase
    .from('ai_coach_intake')
    .select('user_id')
    .eq('disclaimer_accepted', false)
    .in('user_id', profiles.map(p => p.id))

  const started = new Set((startedIntakes ?? []).map(i => i.user_id))

  const nowStr = now.toISOString()
  let d3Sent = 0
  let d7Sent = 0

  for (const profile of profiles) {
    // Skip anyone who finished
    if (completed.has(profile.id)) continue

    const email = emailMap.get(profile.id)
    if (!email) continue

    const firstName =
      (profile.first_name as string | null) ??
      (profile.display_name as string | null)?.split(/\s+/)[0] ??
      null

    const signedUpAt = new Date(profile.created_at as string)
    const hasStarted = started.has(profile.id)

    // ── Day-7 final reminder ──────────────────────────────────────────
    // Window: signed up between 7 and 8 days ago
    // Not yet sent d7
    if (
      signedUpAt <= new Date(d7Cutoff) &&
      signedUpAt >= new Date(d8Cutoff) &&
      !profile.intake_reminder_d7_sent_at
    ) {
      await sendIntakeReminderD7Email({ toEmail: email, firstName })
      await supabase
        .from('profiles')
        .update({ intake_reminder_d7_sent_at: nowStr })
        .eq('id', profile.id)
      d7Sent++
      console.log(`[cron/intake-reminders] Day-7 → ${email}`)
      continue  // don't also send d3 on the same run
    }

    // ── Day-3 reminder ────────────────────────────────────────────────
    // Window: signed up between 3 and 7 days ago
    // Not yet sent d3
    if (
      signedUpAt <= new Date(d3Cutoff) &&
      signedUpAt >= new Date(d7Cutoff) &&
      !profile.intake_reminder_d3_sent_at
    ) {
      await sendIntakeReminderD3Email({ toEmail: email, firstName, hasStarted })
      await supabase
        .from('profiles')
        .update({ intake_reminder_d3_sent_at: nowStr })
        .eq('id', profile.id)
      d3Sent++
      console.log(`[cron/intake-reminders] Day-3 (${hasStarted ? 'started' : 'not started'}) → ${email}`)
    }
  }

  return NextResponse.json({ d3: d3Sent, d7: d7Sent, total_checked: profiles.length })
}
