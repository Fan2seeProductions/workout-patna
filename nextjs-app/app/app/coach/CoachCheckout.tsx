// Coach CTA button. Three modes:
//   "trial"      → no-card 14-day trial via startFreeTrial() server action
//                  (grandfathered early members only)
//   "trial-card" → 14-day trial WITH a card on file, via Stripe Checkout
//                  (new members — card collected up front, charged after day 14)
//   "subscribe"  → straight paid subscription via Stripe Checkout
//                  (trial already used; the route grants no second trial)
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { startFreeTrial } from '../../../lib/actions/coach'

type Mode = 'trial' | 'trial-card' | 'subscribe'

export function CoachCheckout({
  hasIntake,
  mode = 'subscribe',
}: {
  hasIntake: boolean
  mode?: Mode
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function go() {
    setError(null)

    // No-card trial: grant it server-side, then hand off to intake / today's
    // workout. /app/coach re-routes on the next render.
    if (mode === 'trial') {
      start(async () => {
        const res = await startFreeTrial()
        if (!res.ok) {
          setError(res.error ?? 'Could not start trial.')
          return
        }
        router.push(hasIntake ? '/app/coach' : '/app/coach/intake')
        router.refresh()
      })
      return
    }

    // Card modes (trial-card and subscribe): go to Stripe Checkout. The
    // checkout route decides trial eligibility server-side (a 14-day trial
    // for first-timers, none for anyone who already had a subscription).
    // We collect the card first; once the subscription is live, /app/coach
    // forces the intake if it's still missing.
    start(async () => {
      try {
        const res = await fetch('/api/stripe/checkout', { method: 'POST' })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Checkout failed.')
          return
        }
        if (data.url) window.location.href = data.url
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  const label = pending
    ? 'Loading...'
    : mode === 'trial'
      ? 'Start 14-day free trial'
      : mode === 'trial-card'
        ? 'Start 14-day free trial'
        : 'Subscribe to Coach'

  return (
    <>
      <button
        type="button"
        onClick={go}
        disabled={pending}
        className="w-full h-14 rounded-full brand-gradient text-white font-bold text-[16px] disabled:opacity-50"
      >
        {label}
      </button>
      {error && (
        <p className="mt-2 text-[12px] text-[var(--color-danger)] text-center">{error}</p>
      )}
    </>
  )
}
