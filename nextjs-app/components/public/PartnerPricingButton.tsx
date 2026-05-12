'use client'

import { useTransition } from 'react'
import { createPartnerCheckout } from '../../lib/actions/partner-checkout'

export function PartnerPricingButton({
  tier,
  label,
  highlight,
}: {
  tier: string
  label: string
  highlight: boolean
}) {
  const [pending, start] = useTransition()

  if (tier === 'custom') {
    return (
      <a
        href="/for-gyms-apartments#contact"
        className={`mt-6 block w-full text-center h-11 rounded-full inline-flex items-center justify-center font-bold text-[14px] brand-gradient text-white`}
      >
        {label}
      </a>
    )
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        start(async () => {
          const res = await createPartnerCheckout(tier)
          if (res.ok && res.url) {
            window.location.href = res.url
          } else {
            // Stripe not yet configured — fall through to the lead form
            // (use absolute path so it works regardless of which page invoked us).
            window.location.href = '/for-gyms-apartments#contact'
          }
        })
      }}
      className={`mt-6 block w-full text-center h-11 rounded-full inline-flex items-center justify-center font-bold text-[14px] disabled:opacity-60 ${
        highlight
          ? 'bg-white text-[var(--color-primary)]'
          : 'brand-gradient text-white'
      }`}
    >
      {pending ? 'Loading...' : label}
    </button>
  )
}
