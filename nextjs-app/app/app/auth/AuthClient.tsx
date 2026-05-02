// Single-page auth (toggle login / signup). Replit-style split layout.
'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Check, Lock, Mail, User as UserIcon } from 'lucide-react'
import { createClient } from '../../../lib/supabase/client'
import { splashHero } from '../../../lib/photos'

type Mode = 'signin' | 'signup'

export function AuthClient({ initialMode = 'signin' as Mode }: { initialMode?: Mode }) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [pending, setPending] = useState<null | 'email' | 'google'>(null)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const isLogin = mode === 'signin'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setPending('email')
    try {
      const supabase = createClient()
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/app/home')
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/app/onboarding`,
            data: { name, age: age ? parseInt(age, 10) : undefined },
          },
        })
        if (error) throw error
        setInfo('Check your email to confirm your account.')
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setPending(null)
    }
  }

  async function onGoogle() {
    setError(null)
    setPending('google')
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/app/home`,
          skipBrowserRedirect: true,
        },
      })
      if (error) throw error
      if (data?.url) window.location.href = data.url
    } catch (err) {
      setError((err as Error).message)
      setPending(null)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col md:flex-row">

      {/* Left: branding (hidden on mobile) */}
      <div className="relative hidden md:flex flex-1 bg-[var(--color-primary)] text-white p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[var(--color-primary)]/90 mix-blend-multiply z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={splashHero} alt="" className="w-full h-full object-cover opacity-60" />
        </div>

        <div className="relative z-20">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] flex items-center justify-center text-white font-bold font-display text-xl mb-4">
            WP
          </div>
          <h1 className="font-display font-bold text-3xl">Workout Partna</h1>
        </div>

        <div className="relative z-20 space-y-6 max-w-md">
          <h2 className="text-4xl font-display font-bold leading-tight">
            Don&rsquo;t let another workout session slip away.
          </h2>
          <div className="space-y-4">
            {[
              'Find partners at your gym, apartment, or community center',
              'Match by schedule and goals',
              'No trainers, just real people who show up',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-[var(--color-secondary)]" />
                </div>
                <span className="font-medium text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-20 text-sm text-white/60">
          © {new Date().getFullYear()} Workout Partna. Built for community.
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <div className="md:hidden flex justify-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white font-bold font-display text-2xl">
                WP
              </div>
            </div>
            <h2 className="text-3xl font-display font-bold text-[var(--color-foreground)]">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-[var(--color-muted-foreground)] mt-2">
              {isLogin
                ? 'Enter your details to access your account.'
                : 'Join the community and start training together.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}
            {info && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{info}</div>
            )}

            {!isLogin && (
              <>
                <Field label="Full Name">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted-foreground)]" />
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Alex Smith" required
                    className={inputClass}
                  />
                </Field>
                <Field label="Age">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted-foreground)]" />
                  <input
                    type="number" value={age} onChange={e => setAge(e.target.value)}
                    placeholder="25" min={18} max={100} required
                    className={inputClass}
                  />
                </Field>
              </>
            )}

            <Field label="Email">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted-foreground)]" />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="alex@example.com" required autoComplete="email"
                className={inputClass}
              />
            </Field>

            <Field label="Password">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted-foreground)]" />
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                minLength={isLogin ? undefined : 8}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                className={inputClass}
              />
              {isLogin && (
                <div className="text-right mt-1">
                  <Link href="/app/forgot" className="text-xs font-bold text-[var(--color-primary)] hover:underline">Forgot password?</Link>
                </div>
              )}
            </Field>

            <button
              type="submit"
              disabled={pending !== null}
              className="w-full py-3.5 bg-[var(--color-primary)] text-white rounded-xl font-bold text-lg hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2 mt-6 disabled:opacity-60"
            >
              {pending === 'email' ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Get Started'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider + Google */}
          <div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[var(--color-border)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[var(--color-background)] px-2 text-[var(--color-muted-foreground)]">Or continue with</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onGoogle}
              disabled={pending !== null}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-50 transition disabled:opacity-60"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {pending === 'google' ? 'Continuing...' : 'Sign in with Google'}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-[var(--color-muted-foreground)]">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button
              type="button"
              onClick={() => { setMode(isLogin ? 'signup' : 'signin'); setError(null); setInfo(null) }}
              className="ml-2 font-bold text-[var(--color-primary)] hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>

          {!isLogin && (
            <p className="text-xs text-center text-[var(--color-muted-foreground)] px-4">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="underline">Terms of Service</Link>,{' '}
              <Link href="/privacy" className="underline">Privacy Policy</Link>, and{' '}
              <Link href="/waiver" className="underline">Liability Waiver</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const inputClass =
  'w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition text-[var(--color-foreground)]'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-[var(--color-foreground)] ml-1 block">{label}</label>
      <div className="relative">{children}</div>
    </div>
  )
}
