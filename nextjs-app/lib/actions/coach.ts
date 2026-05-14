// Server actions for AI Daily Coach.
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'
import { generateWorkout, type Intake, type AdaptationContext } from '../ai/workout'
import { notifyIntake } from '../email/intake-notify'
import { sendSms, intakeWelcomeSms, sendVoiceWorkout } from '../sms/sms'
import { sendWorkoutToChat } from './coach-chat'

/** Pull yesterday's workout (if any) so the AI can adapt today's plan to it. */
async function loadYesterdayContext(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<AdaptationContext> {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const { data } = await supabase
    .from('ai_workouts')
    .select('focus, feedback')
    .eq('user_id', userId)
    .eq('day', yesterday)
    .maybeSingle()
  if (!data) return {}
  return {
    yesterdayFocus: data.focus ?? null,
    yesterdayFeedback: (data.feedback as AdaptationContext['yesterdayFeedback']) ?? null,
  }
}

export async function saveIntake(patch: Intake & {
  delivery_time?: string
  disclaimer_accepted?: boolean
  disclaimer_version?: string
  sms_opt_in_version?: string
  plays_sports?: boolean
  sports?: string[]
  sport_level?: string
  sport_season?: string
  sport_position?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  // Liability gate — must accept the health/liability acknowledgment.
  if (!patch.disclaimer_accepted) {
    return { ok: false, error: 'You must accept the Health & Liability Acknowledgment to submit.' }
  }

  // Track whether this is a brand-new intake or an edit — used in the email
  // subject line so the coach can spot new clients vs. returning updates at a
  // glance.
  const { data: prev } = await supabase
    .from('ai_coach_intake')
    .select('user_id, updated_at')
    .eq('user_id', user.id)
    .maybeSingle()
  const isNewIntake = !prev

  // Stamp legal records server-side (don't trust the client for these).
  const now = new Date().toISOString()

  // Capture client IP for TCPA defense — the IP at time of opt-in is useful
  // evidence if a user later disputes whether they consented.
  let clientIp: string | null = null
  try {
    const { headers } = await import('next/headers')
    const h = await headers()
    clientIp =
      h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      h.get('x-real-ip') ||
      null
  } catch {
    // Outside a request context; skip
  }

  const intakeRow = {
    user_id: user.id,
    ...patch,
    disclaimer_accepted: true,
    disclaimer_accepted_at: now,
    // Only stamp SMS opt-in fields if the user actually opted in this submission.
    ...(patch.sms_opt_in
      ? { sms_opt_in_at: now, sms_opt_in_ip: clientIp }
      : {}),
  }

  const { error } = await supabase
    .from('ai_coach_intake')
    .upsert(intakeRow, { onConflict: 'user_id' })

  if (error) return { ok: false, error: error.message }

  // Notify on EVERY save. Each intake submission is a real signal — either a
  // new client to onboard, or an existing client whose preferences shifted and
  // whose program needs updating. Coach team manually reviews each one.
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, first_name, last_name')
    .eq('id', user.id)
    .maybeSingle()

  // Pull subscription status so the coach knows immediately whether this is a
  // paying AI Coach subscriber or a free user.
  const { data: sub } = await supabase
    .from('ai_coach_subscriptions')
    .select('status, stripe_subscription_id')
    .eq('user_id', user.id)
    .maybeSingle()

  const subscriptionLabel = sub?.status
    ? `${sub.status}${sub.stripe_subscription_id ? ` · ${sub.stripe_subscription_id}` : ''}`
    : 'no subscription (free user)'

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim()
  const displayName = profile?.display_name || fullName || user.email || '(unknown user)'

  // Format height in feet+inches for the email (more readable than raw inches)
  const heightDisplay = patch.height_inches
    ? `${Math.floor(patch.height_inches / 12)}'${patch.height_inches % 12}" (${patch.height_inches} in)`
    : null

  // ── Welcome SMS (new intake only, SMS opted-in) ────────────────────
  // Fire-and-forget — never delay the response for an SMS delivery hiccup.
  if (isNewIntake && patch.sms_opt_in && patch.phone_number) {
    const firstName =
      (profile?.first_name as string | undefined) ??
      (profile?.display_name as string | undefined)?.split(/\s+/)[0] ??
      null

    const msg = intakeWelcomeSms({
      firstName,
      deliveryTime: patch.delivery_time ?? null,
    })

    sendSms(patch.phone_number, msg).catch(() => {})
  }

  await notifyIntake({
    kind: isNewIntake ? 'AI Coach intake — NEW CLIENT' : 'AI Coach intake — UPDATED',
    category: 'coach',
    who: displayName,
    replyTo: user.email ?? undefined,
    adminUrl: 'https://workoutpartna.com/app/coach',
    fields: [
      { label: 'Status', value: isNewIntake ? '🆕 First-time intake' : '✏️ Edit / re-submit' },
      { label: 'Subscription', value: subscriptionLabel },
      { label: 'User email', value: user.email ?? null },
      { label: 'User ID', value: user.id },
      { label: 'Disclaimer version accepted', value: patch.disclaimer_version ?? null },

      { label: '— Demographics & safety —', value: ' ' },
      { label: 'Age', value: patch.age ?? null },
      { label: 'Sex', value: patch.sex ?? null },
      { label: 'Height', value: heightDisplay },
      { label: 'Weight (lbs)', value: patch.weight_lbs ?? null },
      { label: 'Medical conditions', value: patch.medical_conditions ?? null },
      { label: 'Medications', value: patch.medications ?? null },
      { label: 'Pregnancy / postpartum', value: patch.pregnancy_status ?? null },

      { label: '— Goals & target —', value: ' ' },
      { label: 'Goals', value: patch.goals ?? null },
      { label: 'Specific goal target', value: patch.goal_target ?? null },
      { label: 'Goal target date', value: patch.goal_target_date ?? null },
      { label: 'Target areas', value: patch.target_areas ?? null },
      { label: 'Injuries / limits', value: patch.injuries ?? null },
      { label: 'Mobility issues', value: patch.mobility_issues ?? null },

      { label: '— Programming inputs —', value: ' ' },
      { label: 'Fitness level', value: patch.fitness_level ?? null },
      { label: 'Training style', value: patch.training_style ?? null },
      { label: 'Years training', value: patch.training_years ?? null },
      { label: 'Days per week', value: patch.days_per_week ?? null },
      { label: 'Minutes per session', value: patch.workout_minutes ?? null },
      { label: 'Equipment available', value: patch.equipment ?? null },

      { label: '— Current state (PRs & body) —', value: ' ' },
      { label: 'Bench PR (lbs)', value: patch.pr_bench_lbs ?? null },
      { label: 'Squat PR (lbs)', value: patch.pr_squat_lbs ?? null },
      { label: 'Deadlift PR (lbs)', value: patch.pr_deadlift_lbs ?? null },
      { label: 'Mile time', value: patch.pr_mile_time ?? null },
      { label: 'Body fat %', value: patch.body_fat_pct ?? null },

      { label: '— Lifestyle factors —', value: ' ' },
      { label: 'Avg sleep (hrs/night)', value: patch.sleep_hours_avg ?? null },
      { label: 'Stress level', value: patch.stress_level ?? null },
      { label: 'Occupation activity', value: patch.occupation_activity ?? null },

      { label: '— Personal preferences —', value: ' ' },
      { label: 'Liked exercises', value: patch.liked_exercises ?? null },
      { label: 'Disliked exercises (avoid)', value: patch.disliked_exercises ?? null },
      { label: 'Cardio preference', value: patch.cardio_preference ?? null },
      { label: 'Coaching tone', value: patch.coaching_tone ?? null },
      { label: 'Daily delivery time', value: patch.delivery_time ?? null },

      { label: '— Delivery channel —', value: ' ' },
      { label: 'Phone number', value: patch.phone_number ?? null },
      { label: 'SMS opt-in', value: patch.sms_opt_in ? '✅ YES — OK to text daily workouts' : '❌ No (in-app only)' },
      { label: 'SMS consent version', value: patch.sms_opt_in ? (patch.sms_opt_in_version ?? null) : null },
    ],
  })

  revalidatePath('/app/coach')
  return { ok: true }
}

export async function generateTodayWorkout() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  const today = new Date().toISOString().slice(0, 10)

  // Already generated for today?
  const { data: existing } = await supabase
    .from('ai_workouts')
    .select('id')
    .eq('user_id', user.id)
    .eq('day', today)
    .maybeSingle()

  if (existing) {
    revalidatePath('/app/coach')
    return { ok: true, id: existing.id }
  }

  // Pull intake + profile + yesterday's context so the AI can adapt
  const [{ data: intake }, { data: profile }, ctx] = await Promise.all([
    supabase.from('ai_coach_intake').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('profiles').select('first_name, display_name').eq('id', user.id).maybeSingle(),
    loadYesterdayContext(supabase, user.id),
  ])

  const plan = await generateWorkout(intake as Intake | null, ctx)

  const { data: created, error } = await supabase
    .from('ai_workouts')
    .insert({ user_id: user.id, day: today, ...plan })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }

  // Resolve the member's first name for personalized messages
  const firstName =
    (profile?.first_name as string | null) ??
    (profile?.display_name as string | null)?.split(/\s+/)[0] ??
    null

  // ── In-app chat delivery (always on) ──────────────────────────────
  // Post the workout as a formatted message from the AI Coach bot.
  // Fire-and-forget — never block the response for chat delivery.
  sendWorkoutToChat({ userId: user.id, plan, firstName }).catch(() => {})

  // ── Voice delivery (fire-and-forget) ───────────────────────────────
  // Call the member and read their workout if they opted in to SMS
  // (same consent covers voice — same phone, same product delivery).
  const intakeData = intake as (Intake & { phone_number?: string | null; sms_opt_in?: boolean | null }) | null
  if (intakeData?.sms_opt_in && intakeData?.phone_number) {
    sendVoiceWorkout({ to: intakeData.phone_number, userId: user.id }).catch(() => {})
  }

  revalidatePath('/app/coach')
  return { ok: true, id: created.id }
}

/**
 * Replace today's workout with a freshly-generated one. Used by the
 * "Regenerate" button when the suggested plan doesn't fit (equipment unavailable,
 * too sore, time-crunched, etc.).
 */
export async function regenerateTodayWorkout(reason?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  const today = new Date().toISOString().slice(0, 10)

  const [{ data: intake }, ctx] = await Promise.all([
    supabase.from('ai_coach_intake').select('*').eq('user_id', user.id).maybeSingle(),
    loadYesterdayContext(supabase, user.id),
  ])

  const plan = await generateWorkout(intake as Intake | null, {
    ...ctx,
    regenerateReason: reason?.slice(0, 200) || 'User requested a different workout',
  })

  // Replace today's plan if it exists, otherwise insert a fresh one.
  // (Avoids relying on a unique-constraint upsert.)
  const { data: existing } = await supabase
    .from('ai_workouts')
    .select('id')
    .eq('user_id', user.id)
    .eq('day', today)
    .maybeSingle()

  const patch = { ...plan, feedback: null, completed_at: null }
  const { error } = existing
    ? await supabase.from('ai_workouts').update(patch).eq('id', existing.id)
    : await supabase.from('ai_workouts').insert({ user_id: user.id, day: today, ...patch })

  if (error) return { ok: false, error: error.message }

  revalidatePath('/app/coach')
  return { ok: true }
}

export async function markWorkoutFeedback(
  workoutId: string,
  feedback: 'too_easy' | 'too_hard' | 'sore' | 'skipped' | 'completed',
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false }

  const patch: { feedback: string; completed_at?: string } = { feedback }
  if (feedback === 'completed') patch.completed_at = new Date().toISOString()

  await supabase.from('ai_workouts').update(patch).eq('id', workoutId).eq('user_id', user.id)

  revalidatePath('/app/coach')
  return { ok: true }
}
