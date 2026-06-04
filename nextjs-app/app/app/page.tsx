// Splash / entry screen for the WorkoutPartna app.
// Coach-first pitch: AI Daily Coach with 14-day free trial, no card.
// Full-bleed athlete photo with dark gradient overlay, logo top, CTAs bottom.
import type { Metadata } from 'next'
import { Logo } from '../../components/app/Logo'
import { BrandButton } from '../../components/app/BrandButton'
import { splashHero } from '../../lib/photos'

export const metadata: Metadata = {
  title: 'WorkoutPartna. AI Daily Coach.',
  description: 'A coach in your pocket. Personalized workouts every morning, built around your gym, schedule, and goals. Free for 14 days, no credit card.',
  robots: { index: false, follow: false },
}

export default function SplashPage() {
  return (
    <main className="relative min-h-dvh flex flex-col overflow-hidden">
      {/* Hero photo — same /hero-woman.jpg as the marketing apex, cropped
          to show the subject on the right side (object-[75%_25%]) so the
          left half stays dark enough for the copy + CTAs to sit cleanly. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={splashHero}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-[75%_25%]"
        style={{ opacity: 0.7 }}
      />

      {/* Left→right cinematic gradient: deep on the left (where the copy
          sits), fades through to a soft veil on the right (where the
          subject is). Mirrors the treatment on workoutpartna.com/. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, rgba(5,8,16,0.92) 30%, rgba(5,8,16,0.72) 55%, rgba(5,8,16,0.20) 100%)',
        }}
      />

      {/* Bottom fade to keep the footer CTAs legible no matter the crop. */}
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-48"
        style={{
          background: 'linear-gradient(to top, rgba(5,8,16,0.97), transparent)',
        }}
      />

      {/* Top brand */}
      <header className="relative px-6 pt-10 flex justify-center">
        <Logo size={96} withWordmark />
      </header>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Hero copy */}
      <section className="relative px-6 pb-2 max-w-md mx-auto w-full">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.08] border border-white/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white/85 backdrop-blur-md">
          ✨ 14 days free · No card required
        </span>
        <h1 className="mt-3 text-[44px] font-extrabold leading-[1.05] tracking-tight">
          A coach in your<br />
          <span className="brand-gradient-text">pocket</span>.
        </h1>
        <p className="mt-3 text-[17px] text-white/80 max-w-xs leading-snug">
          Personalized workouts every morning, built around your gym, schedule, and goals.
        </p>

        {/* Feature pills */}
        <ul className="mt-6 flex flex-wrap gap-2 max-w-sm">
          {['Personalized', 'Adapts daily', 'Any equipment', 'Built by AI'].map(t => (
            <li
              key={t}
              className="px-3 py-1.5 rounded-full border border-white/15 bg-white/[0.06] text-[12px] text-white/85 backdrop-blur-md"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* Bottom CTAs */}
      <footer className="relative px-6 pb-10 pt-6 space-y-3 max-w-md mx-auto w-full">
        <BrandButton href="/app/signup" size="lg" className="w-full">
          Try AI Coach free
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
