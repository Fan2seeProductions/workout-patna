// Client form: enter email → Supabase sends a recovery link. The link routes
// through /auth/callback (which exchanges the code for a session) to
// /app/reset, where the user sets a new password.
'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { createClient } from '../../../lib/supabase/client'

export function ForgotForm() {
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/app/reset`,
      })
      if (error) throw error
      setSent(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
      <div className="w-full max-w-md mx-auto px-6 pt-6">
        <Link
          href="/app/auth"
          aria-label="Back to sign in"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-white/55 hover:text-white/85 transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to sign in
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Reset your password</h1>
            <p className="text-white/50 mt-2">
              {sent
                ? 'Check your inbox.'
                : 'Enter your email and we’ll send you a link to set a new password.'}
            </p>
          </div>

          {sent ? (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300 text-sm leading-relaxed">
              If an account exists for <strong className="text-green-200">{email}</strong>, a reset
              link is on its way. Click it, choose a new password, and you’ll be signed straight in.
              The link expires in about an hour.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <label className="block space-y-2">
                <span className="text-sm font-bold text-white/80 ml-1 block">Email</span>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] rounded-xl border border-white/10 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition text-white placeholder:text-white/30 caret-white"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={pending}
                className="w-full py-3.5 bg-[var(--color-primary)] text-white rounded-xl font-bold text-lg hover:opacity-90 transition shadow-lg disabled:opacity-60"
              >
                {pending ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-white/55">
            Remembered it?{' '}
            <Link href="/app/auth" className="font-bold text-[var(--color-primary)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
