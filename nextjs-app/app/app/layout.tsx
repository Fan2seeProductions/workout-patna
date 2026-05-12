// Outer /app layout. Renders the AI Coach promo banner on every page
// underneath /app/* (including pages outside the (shell) group like
// /app/messages, /app/notifications, /app/trainers/[id], etc).
//
// The banner self-hides on:
//   - destination pages (/app/coach, /app/coach/intake)
//   - auth/onboarding flows (/app/auth, /app/signin, /app/onboarding)
//   - admin/trainer-application pages
//   - active subscribers
//   - users who dismissed it this session
import type { ReactNode } from 'react'
import { AICoachPromoBanner, type CoachState } from '../../components/app/AICoachPromoBanner'
import { createClient } from '../../lib/supabase/server'

/** Resolve which AI Coach state copy/CTA to show on the cross-page banner. */
async function loadCoachState(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string | null,
): Promise<{ state: CoachState; trialDaysLeft: number | null }> {
  if (!userId) return { state: 'unauthenticated', trialDaysLeft: null }

  const [{ data: sub }, { data: intake }] = await Promise.all([
    supabase
      .from('ai_coach_subscriptions')
      .select('status, current_period_end')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('ai_coach_intake')
      .select('user_id, disclaimer_accepted')
      .eq('user_id', userId)
      .maybeSingle(),
  ])

  const status = sub?.status as string | undefined
  const hasIntake = !!intake?.user_id && !!intake?.disclaimer_accepted

  // During the trialing phase, Stripe sets current_period_end = the trial-end
  // date. Use that to count days remaining for the banner copy.
  let trialDaysLeft: number | null = null
  if (sub?.current_period_end) {
    const ms = new Date(sub.current_period_end as string).getTime() - Date.now()
    if (ms > 0) trialDaysLeft = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)))
  }

  if (status === 'trialing') {
    return {
      state: hasIntake ? 'trialing-active' : 'trialing-no-intake',
      trialDaysLeft,
    }
  }
  if (status === 'active') {
    return { state: hasIntake ? 'active' : 'active-no-intake', trialDaysLeft: null }
  }
  if (status === 'canceled' || status === 'incomplete_expired') {
    return { state: 'canceled', trialDaysLeft: null }
  }
  return { state: 'no-subscription', trialDaysLeft: null }
}

export default async function AppRootLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { state, trialDaysLeft } = await loadCoachState(supabase, user?.id ?? null)

  return (
    <>
      <AICoachPromoBanner state={state} trialDaysLeft={trialDaysLeft} />
      {children}
    </>
  )
}
