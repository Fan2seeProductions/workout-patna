// Reusable auth form. Email + password, plus Google/Apple OAuth.
// Falls back to a friendly "configure Supabase" message when keys aren't set.
'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../lib/supabase/client'
import { BrandButton } from './BrandButton'

type Mode = 'signin' | 'signup'

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState<null | 'email' | 'google'>(null)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  async function onEmailSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (!supabaseConfigured) {
      setError('Auth backend is not configured yet. Add Supabase keys to .env.local to enable sign in.')
      return
    }

    setPending('email')
    try {
      const supabase = createClient()
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/app/onboarding` },
        })
        if (error) throw error
        setInfo('Check your email to confirm your account.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/app/home')
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setPending(null)
    }
  }

  async function onOAuth(provider: 'google') {
    setError(null)
    if (!supabaseConfigured) {
      setError('Auth backend is not configured yet. Add Supabase keys to .env.local to enable sign in.')
      return
    }
    setPending(provider)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/app/home` },
      })
      if (error) throw error
    } catch (err) {
      setError((err as Error).message)
      setPending(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* OAuth buttons */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => onOAuth('google')}
          disabled={pending !== null}
          className="w-full h-12 rounded-full border border-[var(--color-border-bright)] bg-white/[0.04] flex items-center justify-center gap-2.5 text-[14px] font-semibold text-white hover:bg-white/[0.08] disabled:opacity-50"
        >
          <GoogleMark />
          {pending === 'google' ? 'Continuing...' : 'Continue with Google'}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-[var(--color-border)]" />
        <span className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-text-dim)]">or</span>
        <div className="flex-1 h-px bg-[var(--color-border)]" />
      </div>

      {/* Email form */}
      <form onSubmit={onEmailSubmit} className="space-y-3">
        <div>
          <label className="text-[12px] font-semibold text-[var(--color-text-muted)] mb-1.5 block">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full h-12 rounded-2xl border border-[var(--color-border)] bg-white/[0.04] px-4 text-[14px] text-white placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-brand)]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] font-semibold text-[var(--color-text-muted)]">
              Password
            </label>
            {mode === 'signin' && (
              <Link href="/app/forgot" className="text-[12px] font-semibold text-[var(--color-brand-bright)]">
                Forgot?
              </Link>
            )}
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={mode === 'signup' ? 8 : undefined}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
            className="w-full h-12 rounded-2xl border border-[var(--color-border)] bg-white/[0.04] px-4 text-[14px] text-white placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-brand)]"
          />
        </div>

        {error && (
          <p className="text-[12.5px] text-[var(--color-danger)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 rounded-xl px-3 py-2">
            {error}
          </p>
        )}
        {info && (
          <p className="text-[12.5px] text-[var(--color-match)] bg-[var(--color-match)]/10 border border-[var(--color-match)]/30 rounded-xl px-3 py-2">
            {info}
          </p>
        )}

        <BrandButton type="submit" size="lg" className="w-full" disabled={pending !== null}>
          {pending === 'email'
            ? mode === 'signup' ? 'Creating account...' : 'Signing in...'
            : mode === 'signup' ? 'Create account' : 'Sign in'}
        </BrandButton>
      </form>

      <p className="text-center text-[13px] text-[var(--color-text-muted)]">
        {mode === 'signup' ? (
          <>Already have an account? <Link href="/app/signin" className="font-semibold text-[var(--color-brand-bright)]">Sign in</Link></>
        ) : (
          <>New here? <Link href="/app/signup" className="font-semibold text-[var(--color-brand-bright)]">Create an account</Link></>
        )}
      </p>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.79 2.72v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.62z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.34A9 9 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.95 10.7c-.18-.54-.28-1.11-.28-1.7s.1-1.16.28-1.7V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l2.99-2.34z" fill="#FBBC05" />
      <path d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  )
}

