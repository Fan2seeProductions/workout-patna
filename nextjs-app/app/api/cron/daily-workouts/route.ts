// /api/cron/daily-workouts — Runs every morning to generate and deliver
// personalized workouts to all active AI Coach members.
//
// Flow:
//   1. Pull every member who has completed intake, is not paused, and hasn't
//      received a workout today (via SECURITY DEFINER RPC — no service-role key).
//   2. Generate a workout via Claude for each member using their intake data
//      and yesterday's feedback as context.
//   3. Save the workout + post it to their in-app chat thread (single RPC call).
//
// Secured with CRON_SECRET so only Vercel's scheduler can trigger it.
// Schedule: 12:00 UTC — 7 AM Central during daylight time (Mar–Nov) but
// 6 AM during standard time (Nov–Mar); Vercel cron has no DST awareness.
// Acceptable for now; revisit if members complain about 6 AM winter sends.

import { NextResponse } from 'next/server'
import { generateWorkout, type Intake, type AdaptationContext } from '../../../../lib/ai/workout'
import { formatWorkoutMessage } from '../../../../lib/coach-chat-helpers'
import { sendPushToAll, type PushSubscription } from '../../../../lib/push/send'
import { sendSms } from '../../../../lib/sms/sms'
import { createAdminClient } from '../../../../lib/supabase/admin'

export const runtime = 'nodejs'
export const maxDuration = 300   // up to 5 min for large member batches

type MemberRow = {
  user_id: string
  first_name: string | null
  display_name: string | null
  is_premium: boolean
  phone_number: string | null
  sms_opt_in: boolean
  // intake fields
  goals: string[] | null
  fitness_level: string | null
  days_per_week: number | null
  workout_minutes: number | null
  equipment: string[] | null
  injuries: string | null
  target_areas: string[] | null
  training_style: string | null
  coaching_tone: string | null
  age: number | null
  sex: string | null
  height_inches: number | null
  weight_lbs: number | null
  medical_conditions: string[] | null
  medications: string | null
  pregnancy_status: string | null
  training_years: number | null
  pr_bench_lbs: number | null
  pr_squat_lbs: number | null
  pr_deadlift_lbs: number | null
  pr_mile_time: string | null
  body_fat_pct: number | null
  goal_target: string | null
  goal_target_date: string | null
  sleep_hours_avg: number | null
  stress_level: string | null
  occupation_activity: string | null
  liked_exercises: string | null
  disliked_exercises: string | null
  cardio_preference: string[] | null
  mobility_issues: string | null
  // sports
  plays_sports: boolean | null
  sports: string[] | null
  sport_level: string | null
  sport_season: string | null
  sport_position: string | null
  // yesterday context
  yesterday_focus: string | null
  yesterday_feedback: string | null
}

export async function GET(request: Request) {
  // ── Auth ──────────────────────────────────────────────────────────
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Service-role client — the daily-workouts RPCs are REVOKE'd from anon +
  // authenticated, so only this can reach them (and a cron has no user session).
  const supabase = createAdminClient()
  if (!supabase) {
    console.error('[cron/daily-workouts] SUPABASE_SERVICE_ROLE_KEY not set — cannot run.')
    return NextResponse.json({ error: 'Service role key not configured.' }, { status: 500 })
  }
  const today = new Date().toISOString().slice(0, 10)   // YYYY-MM-DD

  // ── Fetch eligible members ────────────────────────────────────────
  const { data: members, error: fetchErr } = await supabase
    .rpc('get_intake_members_for_cron', { p_today: today })

  if (fetchErr) {
    console.error('[cron/daily-workouts] fetch error:', fetchErr)
    return NextResponse.json({ error: fetchErr.message }, { status: 500 })
  }

  if (!members?.length) {
    return NextResponse.json({ generated: 0, message: 'All members already have workouts for today' })
  }

  const rows = members as unknown as MemberRow[]
  console.log(`[cron/daily-workouts] Generating for ${rows.length} member(s) — ${today}`)

  let generated = 0
  let failed = 0

  for (const member of rows) {
    try {
      // Build intake object for AI
      const intake: Intake = {
        goals:               member.goals,
        fitness_level:       member.fitness_level,
        days_per_week:       member.days_per_week,
        workout_minutes:     member.workout_minutes,
        equipment:           member.equipment,
        injuries:            member.injuries,
        target_areas:        member.target_areas,
        training_style:      member.training_style,
        coaching_tone:       member.coaching_tone,
        age:                 member.age,
        sex:                 member.sex,
        height_inches:       member.height_inches ?? undefined,
        weight_lbs:          member.weight_lbs ?? undefined,
        medical_conditions:  member.medical_conditions,
        medications:         member.medications,
        pregnancy_status:    member.pregnancy_status,
        training_years:      member.training_years ?? undefined,
        pr_bench_lbs:        member.pr_bench_lbs ?? undefined,
        pr_squat_lbs:        member.pr_squat_lbs ?? undefined,
        pr_deadlift_lbs:     member.pr_deadlift_lbs ?? undefined,
        pr_mile_time:        member.pr_mile_time,
        body_fat_pct:        member.body_fat_pct ?? undefined,
        goal_target:         member.goal_target,
        goal_target_date:    member.goal_target_date ?? undefined,
        sleep_hours_avg:     member.sleep_hours_avg ?? undefined,
        stress_level:        member.stress_level,
        occupation_activity: member.occupation_activity,
        liked_exercises:     member.liked_exercises,
        disliked_exercises:  member.disliked_exercises,
        cardio_preference:   member.cardio_preference,
        mobility_issues:     member.mobility_issues,
        plays_sports:        member.plays_sports,
        sports:              member.sports,
        sport_level:         member.sport_level,
        sport_season:        member.sport_season,
        sport_position:      member.sport_position,
      }

      const ctx: AdaptationContext = {
        yesterdayFocus:    member.yesterday_focus,
        yesterdayFeedback: member.yesterday_feedback as AdaptationContext['yesterdayFeedback'],
      }

      // Generate workout via Claude (or fallback template).
      const plan = await generateWorkout(intake, ctx)

      // Resolve first name for the greeting
      const firstName =
        member.first_name ??
        member.display_name?.split(/\s+/)[0] ??
        null

      // Format the chat message
      const chatBody = formatWorkoutMessage(plan, firstName)

      // Save workout + post to chat in one SECURITY DEFINER call
      const { error: saveErr } = await supabase.rpc('bot_save_and_send_workout', {
        p_user_id:   member.user_id,
        p_day:       today,
        p_focus:     plan.focus,
        p_warm_up:   plan.warm_up,
        p_main:      plan.main,
        p_finisher:  plan.finisher,
        p_notes:     plan.notes,
        p_chat_body: chatBody,
      })

      if (saveErr) {
        console.error(`[cron/daily-workouts] save error for ${member.user_id}:`, saveErr.message)
        failed++
        continue
      }

      generated++
      console.log(`[cron/daily-workouts] ✓ ${member.display_name ?? member.user_id}`)

      // ── Push notification (all members with a subscription) ──────
      const { data: pushSubs } = await supabase
        .rpc('get_push_subscriptions_for_user', { p_user_id: member.user_id })

      if (pushSubs?.length) {
        sendPushToAll(pushSubs as PushSubscription[], {
          title: '💪 Your workout is ready!',
          body: `${plan.focus} — tap to open your plan`,
          url: '/app/messages',
          tag: `workout-${today}`,
        }).catch(() => {})
      }

      // ── SMS delivery (premium members only) ──────────────────────
      if (member.is_premium && member.sms_opt_in && member.phone_number) {
        const smsText =
          `💪 ${firstName ? `${firstName}, ` : ''}your WorkoutPartna plan is ready!\n\n` +
          `📌 ${plan.focus}\n\n` +
          `Open the app for your full workout → workoutpartna.com/app/messages`
        sendSms(member.phone_number, smsText).catch(err =>
          console.error(`[cron/daily-workouts] SMS failed for ${member.user_id}:`, err),
        )
      }
    } catch (err) {
      console.error(`[cron/daily-workouts] unexpected error for ${member.user_id}:`, err)
      failed++
    }
  }

  return NextResponse.json({
    generated,
    failed,
    total: rows.length,
    date: today,
  })
}
