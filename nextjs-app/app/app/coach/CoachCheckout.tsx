// Stripe checkout button. Hits /api/stripe/checkout to create a session.
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function CoachCheckout({ hasIntake }: { hasIntake: boolean }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function go() {
    if (!hasIntake) {
      router.push('/app/coach/intake')
      return
    }
    setError(null)
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

  return (
    <>
      <button
        type="button"
        onClick={go}
        disabled={pending}
        className="w-full h-14 rounded-full brand-gradient text-white font-bold text-[16px] disabled:opacity-50"
      >
        {pending ? 'Loading...' : hasIntake ? 'Subscribe to Coach' : 'Start free intake'}
      </button>
      {error && (
        <p className="mt-2 text-[12px] text-[var(--color-danger)] text-center">{error}</p>
      )}
    </>
  )
}
