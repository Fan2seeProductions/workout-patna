// Onboarding step 5: AI Daily Coach paywall upsell.
// User can start free intake or skip into the app.
import Link from 'next/link'
import { OnboardingFrame } from '../../../../components/app/OnboardingFrame'
import { BrandButton } from '../../../../components/app/BrandButton'
import { BrainIcon, CheckIcon, SparkleIcon } from '../../../../components/app/icons'

const benefits = [
  'Personalized workouts texted every morning',
  'Built around your gym, schedule, and goals',
  'Adjusts as you give feedback ("too easy", "sore", "skipped")',
  'Recovery days and mobility built in',
  'Coaches you through challenges with your matches',
]

export default function CoachIntakePage() {
  return (
    <OnboardingFrame step={5} totalSteps={5} backHref="/app/onboarding/profile" skipHref="/app/home">
      <div className="mt-2 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-2xl bg-[var(--color-cyan)]/15 border border-[var(--color-cyan)]/30 flex items-center justify-center text-[var(--color-cyan)]">
          <BrainIcon width={32} height={32} />
        </div>

        <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-[var(--color-cyan)]/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-cyan)]">
          <SparkleIcon width={11} height={11} />
          Optional Upgrade
        </span>

        <h1 className="mt-4 text-[26px] font-extrabold leading-tight tracking-tight">
          Want a coach in your pocket?
        </h1>
        <p className="mt-2 text-[14px] text-[var(--color-text-muted)] max-w-xs">
          AI Daily Coach builds you a custom plan and texts it to you every day.
        </p>
      </div>

      <ul className="mt-6 space-y-2.5">
        {benefits.map(b => (
          <li key={b} className="flex items-start gap-2.5">
            <span className="shrink-0 mt-0.5 h-5 w-5 rounded-full bg-[var(--color-match)]/15 border border-[var(--color-match)]/40 flex items-center justify-center">
              <CheckIcon width={12} height={12} className="text-[var(--color-match)]" />
            </span>
            <span className="text-[14px] text-white/85 leading-snug">{b}</span>
          </li>
        ))}
      </ul>

      {/* Pricing */}
      <div className="mt-6 glass-card p-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-text-muted)]">
            Pricing
          </p>
          <p className="mt-0.5 text-[20px] font-extrabold">
            $9.99 <span className="text-[13px] font-medium text-[var(--color-text-muted)]">/ month</span>
          </p>
        </div>
        <p className="text-[11px] text-[var(--color-text-dim)] max-w-[140px] text-right leading-snug">
          Cancel anytime. First week free.
        </p>
      </div>

      <div className="flex-1 min-h-4" />

      <div className="space-y-2.5 mt-4">
        <BrandButton
          size="lg"
          href="/app/coach/intake"
          className="w-full"
        >
          Start free intake
        </BrandButton>
        <Link
          href="/app/home"
          className="block w-full text-center py-3 text-[14px] font-medium text-[var(--color-text-muted)] hover:text-white"
        >
          Skip for now
        </Link>
      </div>
    </OnboardingFrame>
  )
}
