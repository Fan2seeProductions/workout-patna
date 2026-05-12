// "Regenerate today's workout" button. Lets a user swap the plan if it doesn't fit.
'use client'

import { useState, useTransition } from 'react'
import { regenerateTodayWorkout } from '../../../lib/actions/coach'

const QUICK_REASONS = [
  { label: 'Too sore today', value: "I'm sore, give me a lighter session" },
  { label: 'Short on time', value: 'I only have 20 minutes today' },
  { label: 'Different focus', value: 'I want to train a different body part today' },
  { label: 'Equipment limited', value: 'I only have dumbbells and a bench' },
]

export function RegenerateButton() {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  function submit(text: string) {
    setError(null)
    start(async () => {
      const res = await regenerateTodayWorkout(text)
      if (!res.ok) {
        setError(res.error ?? 'Could not regenerate. Try again.')
        return
      }
      setOpen(false)
      setReason('')
    })
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full h-11 rounded-full border border-white/15 bg-white/[0.04] text-white/85 text-[13px] font-bold hover:bg-white/[0.08] transition flex items-center justify-center gap-2"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v5h5" />
        </svg>
        Regenerate today's workout
      </button>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold text-white">Why a new workout?</p>
        <button
          type="button"
          onClick={() => { setOpen(false); setError(null); setReason('') }}
          className="text-[12px] text-white/60 hover:text-white"
          disabled={pending}
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {QUICK_REASONS.map(r => (
          <button
            key={r.label}
            type="button"
            onClick={() => submit(r.value)}
            disabled={pending}
            className="h-10 px-3 rounded-full border border-white/15 bg-white/[0.04] text-white/85 text-[12px] font-semibold hover:bg-white/[0.08] hover:text-white transition disabled:opacity-50"
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="pt-1">
        <p className="text-[11px] uppercase font-bold tracking-wider text-white/50 mb-1.5">
          Or describe it
        </p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="e.g. My shoulder is acting up, skip overhead work"
          maxLength={200}
          rows={2}
          disabled={pending}
          className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] p-3 text-[13px] text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] resize-none"
        />
        <button
          type="button"
          onClick={() => submit(reason)}
          disabled={pending || reason.trim().length < 3}
          className="mt-2 w-full h-11 rounded-full brand-gradient text-white font-bold text-[13px] disabled:opacity-50 transition"
        >
          {pending ? 'Generating...' : 'Generate new workout'}
        </button>
      </div>

      {error && (
        <p className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-2">
          {error}
        </p>
      )}
    </div>
  )
}
