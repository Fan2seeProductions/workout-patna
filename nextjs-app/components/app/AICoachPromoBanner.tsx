// Cross-page promo banner for the AI Daily Coach. Renders inside the (shell)
// layout so it appears on every signed-in app page EXCEPT the coach itself.
// State-aware: shows different copy for non-subscribers, trialers, subscribers
// without intake, etc. Dismissible per session (won't nag every page load).
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type CoachState =
  | 'no-subscription'       // free user — main upsell target
  | 'trialing-no-intake'    // started trial but hasn't done intake yet
  | 'trialing-active'       // trial running smoothly
  | 'active-no-intake'      // paying but never finished intake (rare)
  | 'active'                // paying + onboarded — banner hides
  | 'canceled'              // ended subscription, may want to come back
  | 'unauthenticated'       // not signed in — banner hides

interface Props {
  state: CoachState
  /** Days remaining on a trial — only used for trialing-* states */
  trialDaysLeft?: number | null
}

/** Pages where the banner should NOT appear (avoids self-reference & noise). */
const HIDE_ON_PATHS: string[] = [
  '/app/coach',
  '/app/coach/intake',
  '/app/onboarding',
  '/app/auth',
  '/app/signin',
  '/app/signup',
  '/app/forgot',
  '/app/reset',
  '/app/admin',
  '/app/trainers/apply', // trainer applicants are coaches, not coaching clients
]

const SESSION_DISMISS_KEY = 'wp.ai-coach-promo.dismissed-this-session'

export function AICoachPromoBanner({ state, trialDaysLeft }: Props) {
  const pathname = usePathname() ?? ''
  const [dismissed, setDismissed] = useState(true) // start hidden, then check session

  useEffect(() => {
    // Only honor dismiss for THIS session — comes back next time they sign in.
    const wasDismissed =
      typeof window !== 'undefined' &&
      window.sessionStorage.getItem(SESSION_DISMISS_KEY) === '1'
    setDismissed(wasDismissed)
  }, [])

  function dismiss() {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_DISMISS_KEY, '1')
    }
    setDismissed(true)
  }

  // ─── Visibility rules ─────────────────────────────────────────────────
  // Hide on coach-related, auth, and onboarding pages
  if (HIDE_ON_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return null
  }
  // Hide for signed-out users
  if (state === 'unauthenticated') return null
  // Hide for fully active subscribers (they're already paying & onboarded)
  if (state === 'active') return null
  // Hide if dismissed this session
  if (dismissed) return null

  // ─── Copy by state ────────────────────────────────────────────────────
  const copy = (() => {
    switch (state) {
      case 'no-subscription':
        return {
          eyebrow: '🤖 AI Daily Coach',
          title: 'Personalized workouts texted every morning',
          body: 'Built around your gym, schedule, goals, and PRs. First week free.',
          cta: 'Start free trial',
          href: '/app/coach',
        }
      case 'trialing-no-intake':
        return {
          eyebrow: `⏳ ${trialDaysLeft ?? 7}-day trial active`,
          title: 'Finish your intake to start receiving workouts',
          body: 'We need your goals, schedule, and equipment to build your plan.',
          cta: 'Complete intake',
          href: '/app/coach/intake',
        }
      case 'trialing-active':
        return {
          eyebrow: `⏳ ${trialDaysLeft ?? 7} days left in trial`,
          title: 'Your AI Coach is live',
          body: 'Open the coach to see today\'s workout or tweak your plan.',
          cta: 'Open AI Coach',
          href: '/app/coach',
        }
      case 'active-no-intake':
        return {
          eyebrow: '🤖 AI Daily Coach',
          title: 'Set up your AI Coach plan',
          body: 'You\'re subscribed — finish your intake and we\'ll start texting workouts tomorrow morning.',
          cta: 'Complete intake',
          href: '/app/coach/intake',
        }
      case 'canceled':
        return {
          eyebrow: '🤖 Come back to AI Daily Coach',
          title: 'Personalized workouts, ready when you are',
          body: 'Resubscribe and pick up where you left off. Your intake is saved.',
          cta: 'Reactivate',
          href: '/app/coach',
        }
      default:
        return null
    }
  })()
  if (!copy) return null

  return (
    <div className="px-4 pt-4 md:px-6 md:pt-6">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[var(--color-primary)]/30 bg-gradient-to-r from-[var(--color-primary)]/[0.12] via-[var(--color-primary)]/[0.06] to-transparent p-4 md:p-5">
        {/* Decorative gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--color-primary)]/30 blur-3xl"
        />

        <div className="relative flex items-start gap-3 md:gap-4">
          <div className="hidden md:flex shrink-0 h-12 w-12 rounded-2xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/40 items-center justify-center text-[22px]">
            🏋️
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] uppercase font-bold tracking-wider text-[var(--color-primary)]">
              {copy.eyebrow}
            </p>
            <p className="mt-1 text-[14.5px] md:text-[16px] font-extrabold text-white leading-tight">
              {copy.title}
            </p>
            <p className="mt-1 text-[12.5px] text-white/70 leading-snug max-w-xl">
              {copy.body}
            </p>

            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <Link
                href={copy.href}
                className="inline-flex h-9 px-4 items-center rounded-full brand-gradient text-white font-bold text-[12.5px] shadow-glow"
              >
                {copy.cta} →
              </Link>
              <button
                type="button"
                onClick={dismiss}
                className="inline-flex h-9 px-3 items-center rounded-full text-white/55 hover:text-white/85 text-[12px] font-semibold transition"
              >
                Dismiss
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss AI Coach banner"
            className="absolute right-2 top-2 md:right-3 md:top-3 h-7 w-7 rounded-full border border-white/10 bg-white/[0.04] text-white/60 hover:text-white/90 hover:bg-white/[0.08] transition flex items-center justify-center text-[14px] leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
