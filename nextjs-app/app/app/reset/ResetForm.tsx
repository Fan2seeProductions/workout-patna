// Client form: set a new password using the recovery session established by
// the email link → /auth/callback. If there's no session (link expired, or
// the page was opened directly), we say so and route back to /app/forgot.
'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { createClient } from '../../../lib/supabase/client'

type SessionState = 'checking' | 'ready' | 'invalid'

export function ResetForm() {
  const [session, setSession] = useState<SessionState>('checking')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  // The recovery link (via /auth/callback) sets a session cookie. If it's
  // present we can change the password; if not, the link was invalid/expired.
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setSession(data.user ? 'ready' : 'invalid')
    })
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('Use at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords don’t match.')
      return
    }
    setPending(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true)
      // The recovery session is now a full session — send them into the app.
      setTimeout(() => { window.location.href = '/app/coach' }, 1200)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Set a new password</h1>
          <p className="text-white/50 mt-2">
            {done ? 'All set — signing you in…' : 'Choose a new password for your account.'}
          </p>
        </div>

        {session === 'checking' && (
          <p className="text-white/50 text-sm">Verifying your reset link…</p>
        )}

        {session === 'invalid' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 text-sm leading-relaxed">
              This reset link is invalid or has expired. Reset links are single-use and last about
              an hour — request a fresh one.
            </div>
            <Link
              href="/app/forgot"
              className="inline-flex w-full justify-center py-3.5 bg-[var(--color-primary)] text-white rounded-xl font-bold text-lg hover:opacity-90 transition"
            >
              Request a new link
            </Link>
          </div>
        )}

        {session === 'ready' && !done && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <label className="block space-y-2">
              <span className="text-sm font-bold text-white/80 ml-1 block">New password</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] rounded-xl border border-white/10 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition text-white placeholder:text-white/30 caret-white"
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-bold text-white/80 ml-1 block">Confirm password</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] rounded-xl border border-white/10 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition text-white placeholder:text-white/30 caret-white"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3.5 bg-[var(--color-primary)] text-white rounded-xl font-bold text-lg hover:opacity-90 transition shadow-lg disabled:opacity-60"
            >
              {pending ? 'Saving…' : 'Update password'}
            </button>
          </form>
        )}

        {done && (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300 text-sm">
            Password updated. Taking you to your coach…
          </div>
        )}
      </div>
    </div>
  )
}
