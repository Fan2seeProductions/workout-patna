// AI Daily Coach landing.
// If no subscription: paywall.
// If subscribed: today's workout.
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '../../../lib/supabase/server'
import { generateTodayWorkout } from '../../../lib/actions/coach'
import { BackIcon, BrainIcon, CheckIcon, SparkleIcon } from '../../../components/app/icons'
import { CoachCheckout } from './CoachCheckout'
import { CoachToday } from './CoachToday'
import { isGrandfathered } from '../../../lib/coach-trial'
import { matchExercisesInText, exerciseImageUrl } from '../../../lib/exercises/match'

export const metadata = { title: 'AI Daily Coach', robots: { index: false, follow: false } }

const benefits = [
  'One personalized workout, built for you every morning',
  'Every exercise illustrated — photos and step-by-step form guides',
  'Adapts daily to your feedback — harder, easier, or a recovery day',
  'Works anywhere: gym, home, hotel, or just a desk chair',
  'Instant 5-minute Desk Breaks between meetings',
  'Delivered in-app, by text, or a voice call that reads it to you',
]

export default async function CoachPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const [{ data: sub }, { data: intake }] = await Promise.all([
    supabase.from('ai_coach_subscriptions').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('ai_coach_intake').select('*').eq('user_id', user.id).maybeSingle(),
  ])

  // Subscribed if status is live AND we haven't passed current_period_end.
  // This is what makes the 14-day no-card trial fall off the cliff cleanly
  // when the period ends, without needing a cron job to flip the status.
  const periodOk =
    !sub?.current_period_end ||
    new Date(sub.current_period_end as string) > new Date()
  // past_due keeps access during Stripe's smart-retry window — a paying
  // member with a temporarily bounced card shouldn't be locked out mid-retry.
  // Stripe flips it to canceled/unpaid if all retries fail, which ends access.
  const subscribed =
    !!sub &&
    (sub.status === 'active' || sub.status === 'trialing' || sub.status === 'past_due') &&
    periodOk

  // Has the user ever started a trial / subscription? If so we don't show
  // the "Start free trial" CTA again — they'd go straight to Stripe.
  const trialAlreadyUsed = !!sub

  // Grandfathered members (signed up on/before the cutoff) keep the original
  // no-credit-card trial. Everyone who signed up after must put a card on
  // file up front (Stripe Checkout with a 14-day trial before first charge).
  const grandfathered = isGrandfathered(user.created_at)

  // Subscribed path: ensure today's workout exists, then show it
  if (subscribed) {
    if (!intake) redirect('/app/coach/intake')

    // Generation failure must not 500 the whole coach page — fall through
    // and render whatever workout exists (or the empty state) instead.
    try {
      await generateTodayWorkout()
    } catch (err) {
      console.error('[coach] generateTodayWorkout failed:', err)
    }
    const today = new Date().toISOString().slice(0, 10)

    const [{ data: workout }, { data: recent }] = await Promise.all([
      supabase.from('ai_workouts').select('*').eq('user_id', user.id).eq('day', today).maybeSingle(),
      supabase
        .from('ai_workouts')
        .select('day, completed_at')
        .eq('user_id', user.id)
        .gte('day', new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10))
        .order('day', { ascending: false }),
    ])

    if (!workout) {
      return (
        <main className="min-h-dvh bg-[var(--color-background)] text-white flex items-center justify-center px-6">
          <p className="text-[14px] text-[var(--color-text-muted)] text-center">Building today&apos;s workout…</p>
        </main>
      )
    }

    // Consecutive-day completion streak ending today/yesterday.
    const doneDays = new Set((recent ?? []).filter(w => w.completed_at).map(w => w.day as string))
    let streak = 0
    for (let i = 0; i < 30; i++) {
      const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10)
      if (doneDays.has(d)) streak++
      else if (i > 0) break // today not-yet-done shouldn't break the streak
    }

    const equipmentList = (intake.equipment as string[] | null) ?? []
    const equipment = equipmentList.length ? equipmentList.join(', ') : 'Bodyweight only'
    const areas = ((intake.target_areas as string[] | null) ?? [])
    const goals = ((intake.goals as string[] | null) ?? [])
    const activity = (areas.length ? areas : goals).slice(0, 2).join(', ')
      || (intake.training_style as string | null) || 'Full body'

    const dateLabel = new Date(today + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()

    // Match exercises named in the plan against the bundled photo/how-to
    // database (server-side — only matched cards travel to the client).
    const guide = matchExercisesInText(
      [workout.warm_up, workout.main, workout.finisher].filter(Boolean).join('\n'),
    ).map(ex => ({
      id: ex.id,
      name: ex.name,
      level: ex.level,
      muscles: ex.primaryMuscles,
      imageUrls: ex.images.map(exerciseImageUrl),
      steps: ex.instructions,
    }))

    return (
      <CoachToday
        workout={{
          id: workout.id,
          focus: workout.focus,
          warm_up: workout.warm_up,
          main: workout.main,
          finisher: workout.finisher,
          notes: workout.notes,
          feedback: workout.feedback ?? null,
        }}
        meta={{
          minutes: (intake.workout_minutes as number | null) ?? 30,
          level: (intake.fitness_level as string | null) ?? 'All levels',
          equipment,
          activity,
          dateLabel,
          streak,
        }}
        heroSrc="/hero-woman.jpg"
        guide={guide}
      />
    )
  }

  // Paywall path
  return (
    <main className="min-h-dvh px-6 pt-6 pb-10 max-w-md mx-auto">
      <header className="flex items-center justify-between">
        <Link
          href="/app/home"
          aria-label="Back"
          className="h-9 w-9 rounded-full border border-[var(--color-border)] bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-foreground)]"
        >
          <BackIcon width={18} height={18} />
        </Link>
        <span className="w-9" />
      </header>

      <div className="mt-8 flex flex-col items-center text-center">
        <div className="h-20 w-20 rounded-3xl bg-[var(--color-cyan)]/15 border border-[var(--color-cyan)]/30 flex items-center justify-center text-[var(--color-cyan)]">
          <BrainIcon width={36} height={36} />
        </div>
        <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-[var(--color-cyan)]/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-cyan)]">
          <SparkleIcon width={11} height={11} /> Premium
        </span>
        <h1 className="mt-4 text-[28px] font-extrabold leading-tight tracking-tight">
          AI Daily Coach
        </h1>
        <p className="mt-2 text-[14px] text-[var(--color-text-muted)] max-w-xs">
          A coach in your pocket. Personalized workouts built around your goals, schedule, and gym.
        </p>
      </div>

      <ul className="mt-8 space-y-2.5">
        {benefits.map(b => (
          <li key={b} className="flex items-start gap-2.5">
            <span className="shrink-0 mt-0.5 h-5 w-5 rounded-full bg-[var(--color-match)]/15 border border-[var(--color-match)]/40 flex items-center justify-center">
              <CheckIcon width={12} height={12} className="text-[var(--color-match)]" />
            </span>
            <span className="text-[14px] text-[var(--color-foreground)] leading-snug">{b}</span>
          </li>
        ))}
      </ul>

      {!trialAlreadyUsed && grandfathered ? (
        /* Grandfathered member — original no-credit-card 14-day trial. */
        <>
          <div className="mt-8 glass-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-cyan)]">
                  14-day free trial
                </p>
                <p className="mt-0.5 text-[24px] font-extrabold">
                  Free <span className="text-[14px] font-medium text-[var(--color-text-muted)]">for 14 days</span>
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[var(--color-match)]/15 border border-[var(--color-match)]/40 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-match)]">
                No card required
              </span>
            </div>
            <p className="mt-2 text-[12px] text-[var(--color-text-dim)] leading-snug">
              You're an early member, so your trial needs no card. After 14 days it's $9.99/mo and we'll prompt you to subscribe before charging anything.
            </p>
          </div>

          <div className="mt-6">
            <CoachCheckout hasIntake={!!intake} mode="trial" />
          </div>

          <p className="mt-3 text-center text-[11px] text-[var(--color-text-dim)]">
            No credit card, no commitment.
          </p>
        </>
      ) : !trialAlreadyUsed && !grandfathered ? (
        /* New member — 14-day trial with a card on file (charged after). */
        <>
          <div className="mt-8 glass-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-cyan)]">
                  14-day free trial
                </p>
                <p className="mt-0.5 text-[24px] font-extrabold">
                  Free <span className="text-[14px] font-medium text-[var(--color-text-muted)]">for 14 days</span>
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[var(--color-cyan)]/15 border border-[var(--color-cyan)]/30 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-cyan)]">
                Card required
              </span>
            </div>
            <p className="mt-2 text-[12px] text-[var(--color-text-dim)] leading-snug">
              $0 today. We add a card now and you're not charged until day 15. Cancel anytime before then and you pay nothing. Then $9.99/mo.
            </p>
          </div>

          <div className="mt-6">
            <CoachCheckout hasIntake={!!intake} mode="trial-card" />
          </div>

          <p className="mt-3 text-center text-[11px] text-[var(--color-text-dim)]">
            Secure checkout via Stripe. Cancel anytime.
          </p>
        </>
      ) : (
        <>
          <div className="mt-8 glass-card p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-text-muted)]">
                Pricing
              </p>
              <p className="mt-0.5 text-[24px] font-extrabold">
                $9.99 <span className="text-[14px] font-medium text-[var(--color-text-muted)]">/ month</span>
              </p>
            </div>
            <p className="text-[11px] text-[var(--color-text-dim)] max-w-[140px] text-right leading-snug">
              Your free trial has ended. Cancel anytime.
            </p>
          </div>

          <div className="mt-6">
            <CoachCheckout hasIntake={!!intake} mode="subscribe" />
          </div>

          <p className="mt-3 text-center text-[11px] text-[var(--color-text-dim)]">
            Secure checkout via Stripe.
          </p>
        </>
      )}
    </main>
  )
}
