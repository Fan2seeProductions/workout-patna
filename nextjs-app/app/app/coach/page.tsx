// AI Daily Coach landing.
// If no subscription: paywall.
// If subscribed: today's workout.
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '../../../lib/supabase/server'
import { generateTodayWorkout } from '../../../lib/actions/coach'
import { BackIcon, BrainIcon, CheckIcon, SparkleIcon } from '../../../components/app/icons'
import { CoachCheckout } from './CoachCheckout'
import { WorkoutFeedback } from './WorkoutFeedback'

export const metadata = { title: 'AI Daily Coach', robots: { index: false, follow: false } }

const benefits = [
  'See Partnas at every gym across the Houston metro (not just yours)',
  'Personalized AI workouts texted every morning',
  'Built around your gym, schedule, and goals',
  'Advanced filters: distance, schedule overlap, fitness level',
  'Priority placement on other Partnas’ Discover',
]

export default async function CoachPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const [{ data: sub }, { data: intake }] = await Promise.all([
    supabase.from('ai_coach_subscriptions').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('ai_coach_intake').select('*').eq('user_id', user.id).maybeSingle(),
  ])

  const subscribed = sub && (sub.status === 'active' || sub.status === 'trialing')

  // Subscribed path: ensure today's workout exists, then show it
  if (subscribed) {
    if (!intake) redirect('/app/coach/intake')

    await generateTodayWorkout()
    const today = new Date().toISOString().slice(0, 10)
    const { data: workout } = await supabase
      .from('ai_workouts')
      .select('*')
      .eq('user_id', user.id)
      .eq('day', today)
      .maybeSingle()

    return (
      <main className="min-h-dvh">
        <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-xl">
          <div className="mx-auto max-w-md px-4 py-3 flex items-center gap-3">
            <Link
              href="/app/home"
              aria-label="Back"
              className="h-9 w-9 rounded-full border border-[var(--color-border)] bg-white/[0.04] flex items-center justify-center text-white/85"
            >
              <BackIcon width={18} height={18} />
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-cyan)]">
                Today's Workout
              </p>
              <h1 className="font-bold text-[16px] text-white truncate">{workout?.focus ?? 'Loading...'}</h1>
            </div>
            <Link href="/app/coach/intake" className="text-[12px] font-semibold text-[var(--color-brand-bright)]">
              Edit
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-md px-5 py-6 space-y-5">
          {!workout ? (
            <p className="text-[14px] text-[var(--color-text-muted)] text-center">
              Generating your workout...
            </p>
          ) : (
            <>
              <Block label="Warm-up" body={workout.warm_up} />
              <Block label="Main workout" body={workout.main} />
              <Block label="Finisher" body={workout.finisher} />
              {workout.notes && <Block label="Coach's notes" body={workout.notes} dim />}
              <WorkoutFeedback workoutId={workout.id} current={workout.feedback ?? null} />
            </>
          )}
        </div>
      </main>
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
          Cancel anytime. First week free.
        </p>
      </div>

      <div className="mt-6">
        <CoachCheckout hasIntake={!!intake} />
      </div>

      <p className="mt-3 text-center text-[11px] text-[var(--color-text-dim)]">
        Secure checkout via Stripe.
      </p>
    </main>
  )
}

function Block({ label, body, dim = false }: { label: string; body: string | null; dim?: boolean }) {
  if (!body) return null
  return (
    <div className={`glass-card p-4 ${dim ? 'opacity-90' : ''}`}>
      <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-brand-bright)]">{label}</p>
      <p className="mt-2 text-[14px] text-white/90 leading-relaxed whitespace-pre-line">{body}</p>
    </div>
  )
}
