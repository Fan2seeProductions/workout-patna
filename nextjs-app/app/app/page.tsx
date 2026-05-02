// Splash / entry screen for the WorkoutPartna app.
// Layout mirrors the marketing flyer: logo top, hero copy + photo,
// 4 feature cards, JOIN NOW + LEARN MORE, app store badges.
import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '../../components/app/Logo'
import { HeroImage } from '../../components/app/HeroImage'
import { splashHero, splashHeroFallback } from '../../lib/photos'

export const metadata: Metadata = {
  title: 'WorkoutPartna. Find your gym person',
  description: 'Find your gym person. Connect, train, grow stronger together.',
  robots: { index: false, follow: false },
}

const features = [
  {
    label: 'MATCH',
    body: 'Find the right workout partners near you.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3.2" /><path d="M3 21a6 6 0 0 1 12 0" />
        <circle cx="17" cy="9" r="2.6" /><path d="M14 21a5 5 0 0 1 9 0" opacity="0.7" />
      </svg>
    ),
  },
  {
    label: 'COMMUNITY',
    body: 'Join local gyms, groups, and challenges.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="3" /><path d="M5 20a7 7 0 0 1 14 0" />
        <circle cx="5" cy="10" r="2.2" /><circle cx="19" cy="10" r="2.2" />
        <path d="M2 18a4 4 0 0 1 4-2.5M22 18a4 4 0 0 0-4-2.5" opacity="0.7" />
      </svg>
    ),
  },
  {
    label: 'ACCOUNTABILITY',
    body: 'Stay consistent with people who push you.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <path d="M12 3l3 5M21 12l-5 3" opacity="0.6" />
      </svg>
    ),
  },
  {
    label: 'AI COACH',
    body: 'Get personalized workouts and daily text coaching.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
        <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
      </svg>
    ),
  },
]

export default function SplashPage() {
  return (
    <main className="min-h-dvh bg-[var(--color-bg)]">
      <div className="mx-auto max-w-md px-5 pt-8 pb-8">
        {/* Logo + tagline header */}
        <header className="flex flex-col items-center text-center">
          <Logo size={72} withWordmark vertical />
        </header>

        {/* Hero copy */}
        <section className="mt-6">
          <h1 className="text-[44px] font-extrabold leading-[1.05] tracking-tight">
            <span className="text-white">Find your</span>
            <br />
            <span className="brand-gradient-text">gym person.</span>
          </h1>
          <p className="mt-3 text-[16px] text-white/75 leading-snug">
            Connect. Train. Grow.
            <br />
            Stronger together.
          </p>
        </section>

        {/* Hero photo */}
        <section className="mt-5 relative aspect-[4/5] rounded-2xl overflow-hidden border border-[var(--color-border)]">
          <HeroImage
            src={splashHero}
            fallback={splashHeroFallback}
            alt="WorkoutPartna members"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute right-3 top-3 opacity-90">
            <Logo size={36} />
          </div>
        </section>

        {/* Feature cards (4 in a row) */}
        <section className="mt-5">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white/[0.03] p-3">
            <div className="grid grid-cols-4 gap-2">
              {features.map(f => (
                <div key={f.label} className="flex flex-col items-center text-center px-1">
                  <div className="text-[var(--color-brand-bright)] mb-2 mt-1">{f.icon}</div>
                  <p className="text-[9px] font-extrabold tracking-wider text-white">{f.label}</p>
                  <p className="mt-1 text-[10px] text-white/65 leading-tight">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="mt-6 space-y-3">
          <Link
            href="/app/signup"
            className="block w-full h-14 rounded-full brand-gradient flex items-center justify-center text-white font-extrabold text-[16px] tracking-wider shadow-[0_8px_24px_-4px_rgba(59,130,246,0.45)]"
          >
            JOIN NOW
          </Link>
          <Link
            href="/app/signin"
            className="block w-full h-14 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-white/90 font-bold text-[15px] tracking-wider"
          >
            LEARN MORE
          </Link>
        </section>

        {/* App store badges (placeholders until apps ship) */}
        <section className="mt-6 grid grid-cols-2 gap-3">
          <span
            aria-label="Download on the App Store (coming soon)"
            className="h-14 rounded-xl border border-[var(--color-border)] bg-white/[0.04] flex items-center justify-center gap-2 text-white/85 text-[12px] font-semibold opacity-70 cursor-not-allowed"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 12.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.6-1-2.6-4z M14 4c.7-.9 1.2-2.1 1.1-3.3-1 .1-2.3.7-3 1.5-.7.8-1.2 2-1.1 3.2 1.1.1 2.3-.5 3-1.4z" />
            </svg>
            <div className="text-left leading-tight">
              <p className="text-[8px] uppercase opacity-70">Download on the</p>
              <p className="text-[13px]">App Store</p>
            </div>
          </span>
          <span
            aria-label="Get it on Google Play (coming soon)"
            className="h-14 rounded-xl border border-[var(--color-border)] bg-white/[0.04] flex items-center justify-center gap-2 text-white/85 text-[12px] font-semibold opacity-70 cursor-not-allowed"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.6 1.8L13.7 12 3.6 22.2c-.4-.3-.6-.7-.6-1.2V3c0-.5.2-.9.6-1.2zM14.7 13l3.7 3.7-12.6 5 8.9-8.7zM18.4 7.3l-3.7 3.7L5.8 2.3l12.6 5zM21.7 12l-3.6 2.5-2.7-2.5 2.7-2.5L21.7 12z" />
            </svg>
            <div className="text-left leading-tight">
              <p className="text-[8px] uppercase opacity-70">Get it on</p>
              <p className="text-[13px]">Google Play</p>
            </div>
          </span>
        </section>

        <p className="mt-6 text-center text-[11px] text-white/45">
          By continuing, you agree to our{' '}
          <a href="/terms" className="underline">Terms</a> and{' '}
          <a href="/privacy" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </main>
  )
}
