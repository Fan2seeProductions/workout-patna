// Coach CTA button. Two modes:
//   "trial"     → call startFreeTrial() server action (no Stripe, no card)
//   "subscribe" → hit /api/stripe/checkout for a paid subscription
// If the user hasn't filled the intake yet we send them there first, regardless.
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { startFreeTrial } from '../../../lib/actions/coach'

type Mode = 'trial' | 'subscribe'

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

    if (mode === 'trial') {
      start(async () => {
        const res = await startFreeTrial()
        if (!res.ok) {
          setError(res.error ?? 'Could not start trial.')
          return
        }
        // After granting the trial, hand them off to intake (if needed) or to
        // today's workout. /app/coach re-routes for us on next render.
        router.push(hasIntake ? '/app/coach' : '/app/coach/intake')
        router.refresh()
      })
      return
    }

    // Subscribe mode: Stripe checkout
    if (!hasIntake) {
      router.push('/app/coach/intake')
      return
    }
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
      : hasIntake
        ? 'Subscribe to Coach'
        : 'Start free intake'

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
