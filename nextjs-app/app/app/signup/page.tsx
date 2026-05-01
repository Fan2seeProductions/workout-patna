// Sign up page.
import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '../../../components/app/Logo'
import { AuthForm } from '../../../components/app/AuthForm'
import { BackIcon } from '../../../components/app/icons'

export const metadata: Metadata = {
  title: 'Create your account',
  robots: { index: false, follow: false },
}

export default function SignupPage() {
  return (
    <main className="min-h-dvh flex flex-col px-6 pt-6 pb-10 max-w-md mx-auto w-full">
      <header className="flex items-center justify-between">
        <Link
          href="/app"
          aria-label="Back"
          className="h-9 w-9 rounded-full border border-[var(--color-border)] bg-white/[0.04] flex items-center justify-center text-white/85"
        >
          <BackIcon width={18} height={18} />
        </Link>
        <Logo size={26} withWordmark />
        <span className="w-9" />
      </header>

      <div className="mt-10">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight">
          Find your <span className="brand-gradient-text">gym person</span>.
        </h1>
        <p className="mt-1.5 text-[14px] text-[var(--color-text-muted)]">
          Create an account in 30 seconds. We'll guide you through onboarding next.
        </p>
      </div>

      <div className="mt-8">
        <AuthForm mode="signup" />
      </div>
    </main>
  )
}
