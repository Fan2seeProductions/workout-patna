// Frame for every onboarding step. Top progress bar, back arrow, content slot.
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BackIcon } from './icons'

type Props = {
  step: number
  totalSteps: number
  backHref?: string
  skipHref?: string
  children: React.ReactNode
}

export function OnboardingFrame({ step, totalSteps, backHref, skipHref, children }: Props) {
  const router = useRouter()
  const pct = (step / totalSteps) * 100

  return (
    <main className="min-h-dvh flex flex-col">
      <header className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between gap-3">
          {backHref ? (
            <Link
              href={backHref}
              aria-label="Back"
              className="h-9 w-9 rounded-full border border-[var(--color-border)] bg-white/[0.04] flex items-center justify-center text-white/85"
            >
              <BackIcon width={18} height={18} />
            </Link>
          ) : (
            <button
              onClick={() => router.back()}
              aria-label="Back"
              className="h-9 w-9 rounded-full border border-[var(--color-border)] bg-white/[0.04] flex items-center justify-center text-white/85"
            >
              <BackIcon width={18} height={18} />
            </button>
          )}

          <div className="flex-1 h-1 rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full brand-gradient transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>

          {skipHref ? (
            <Link href={skipHref} className="text-[13px] font-semibold text-[var(--color-text-muted)] hover:text-white">
              Skip
            </Link>
          ) : (
            <span className="w-9" />
          )}
        </div>
        <p className="mt-2 text-[11px] text-[var(--color-text-dim)] font-medium">
          Step {step} of {totalSteps}
        </p>
      </header>

      <div className="flex-1 flex flex-col px-6 pb-8 max-w-md mx-auto w-full">
        {children}
      </div>
    </main>
  )
}
