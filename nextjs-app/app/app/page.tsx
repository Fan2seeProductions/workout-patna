// Splash / entry screen for the WorkoutPartna app.
// Full-bleed athlete photo with dark gradient overlay, logo top, CTAs bottom.
import type { Metadata } from 'next'
import { Logo } from '../../components/app/Logo'
import { BrandButton } from '../../components/app/BrandButton'
import { splashHero } from '../../lib/photos'

export const metadata: Metadata = {
  title: 'WorkoutPartna. Find your gym person',
  description: 'Find your gym person. Not a personal trainer.',
  robots: { index: false, follow: false },
}

export default function SplashPage() {
  return (
    <main className="relative min-h-dvh flex flex-col overflow-hidden">
      {/* Hero photo background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={splashHero}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Top to bottom gradient overlay for legibility */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,8,16,0.6) 0%, rgba(5,8,16,0.35) 30%, rgba(5,8,16,0.7) 60%, rgba(5,8,16,0.97) 92%)',
        }}
      />

      {/* Brand color tint over the photo */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-multiply opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(59,130,246,0.5), transparent 60%), radial-gradient(ellipse at bottom right, rgba(20,184,166,0.4), transparent 60%)',
        }}
      />

      {/* Top brand */}
      <header className="relative px-6 pt-10 flex justify-center">
        <Logo size={32} withWordmark />
      </header>

      {/* Spacer pushes content down */}
      <div className="flex-1" />

      {/* Hero copy */}
      <section className="relative px-6 pb-2 max-w-md mx-auto w-full">
        <h1 className="text-[44px] font-extrabold leading-[1.05] tracking-tight">
          Find your<br />
          <span className="brand-gradient-text">gym person</span>.
        </h1>
        <p className="mt-3 text-[17px] text-white/80 max-w-xs leading-snug">
          Not a personal trainer. A real partner who shows up at your gym, on your schedule.
        </p>

        {/* Feature pills */}
        <ul className="mt-6 flex flex-wrap gap-2 max-w-sm">
          {['Match', 'Community', 'Accountability', 'AI Coach'].map(t => (
            <li
              key={t}
              className="px-3 py-1.5 rounded-full border border-white/15 bg-white/[0.06] text-[12px] text-white/85 backdrop-blur-md"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* Bottom CTA stack */}
      <footer className="relative px-6 pb-10 pt-6 space-y-3 max-w-md mx-auto w-full">
        <BrandButton href="/app/signup" size="lg" className="w-full">
          Get Started, it's free
        </BrandButton>
        <BrandButton href="/app/signin" size="lg" variant="secondary" className="w-full">
          I already have an account
        </BrandButton>
        <p className="text-center text-[11px] text-white/55 pt-1">
          By continuing, you agree to our{' '}
          <a href="/terms" className="underline underline-offset-2">Terms</a> and{' '}
          <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a>.
        </p>
      </footer>
    </main>
  )
}
