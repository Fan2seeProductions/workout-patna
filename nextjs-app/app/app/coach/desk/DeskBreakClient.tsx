// Desk Break client — context + duration picker, instant generation, and the
// illustrated result with photo/how-to cards.
'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { generateDeskBreak, type DeskContext, type DeskBreak } from '../../../../lib/actions/desk'
import { ExerciseGuide } from '../../../../components/app/ExerciseGuide'

const CONTEXTS: { id: DeskContext; emoji: string; label: string }[] = [
  { id: 'desk',         emoji: '🪑', label: 'At my desk' },
  { id: 'standing',     emoji: '🧍', label: 'Standing desk' },
  { id: 'hotel',        emoji: '🏨', label: 'Hotel room' },
  { id: 'bands',        emoji: '🎗️', label: 'Bands only' },
  { id: 'no-equipment', emoji: '🏠', label: 'Home, no gear' },
]

const DURATIONS = [5, 10, 15] as const

export function DeskBreakClient() {
  const [context, setContext] = useState<DeskContext>('desk')
  const [minutes, setMinutes] = useState<(typeof DURATIONS)[number]>(5)
  const [result, setResult] = useState<DeskBreak | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  function go() {
    setError(null)
    start(async () => {
      const res = await generateDeskBreak(context, minutes)
      if (!res.ok || !res.breakWorkout) {
        setError(res.error ?? 'Couldn’t build your break — try again →')
        return
      }
      setResult(res.breakWorkout)
    })
  }

  return (
    <main className="min-h-dvh bg-[var(--color-background)] text-white pb-24">
      <header className="sticky top-0 z-30 bg-[var(--color-background)]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/app/coach"
            aria-label="Back"
            className="h-9 w-9 rounded-full bg-white/[0.06] flex items-center justify-center text-white/85"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div>
            <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-primary)]">Desk Break</p>
            <h1 className="font-bold text-[15px]">Move between meetings</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-5 py-6 space-y-6">
        {!result && (
          <>
            <div>
              <p className="text-[12px] uppercase font-bold tracking-wider text-white/50 mb-2.5">
                Where are you right now?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {CONTEXTS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setContext(c.id)}
                    className={`h-12 px-4 rounded-full border text-[13px] font-bold transition text-left flex items-center gap-2 ${
                      context === c.id
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/12 text-[var(--color-primary)]'
                        : 'border-white/15 bg-white/[0.04] text-white/80 hover:bg-white/[0.08]'
                    }`}
                  >
                    <span aria-hidden>{c.emoji}</span> {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[12px] uppercase font-bold tracking-wider text-white/50 mb-2.5">
                How long do you have?
              </p>
              <div className="flex gap-2">
                {DURATIONS.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setMinutes(d)}
                    className={`flex-1 h-12 rounded-full border text-[14px] font-bold transition ${
                      minutes === d
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/12 text-[var(--color-primary)]'
                        : 'border-white/15 bg-white/[0.04] text-white/80 hover:bg-white/[0.08]'
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={go}
              disabled={pending}
              className="w-full h-14 rounded-full brand-gradient text-white font-extrabold text-[15px] disabled:opacity-60"
            >
              {pending ? 'Building your break…' : 'Generate My Break →'}
            </button>

            {error && (
              <p className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-2.5">{error}</p>
            )}
          </>
        )}

        {result && (
          <>
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-primary)]">
                {minutes}-minute break
              </p>
              <h2 className="mt-1 text-[26px] font-extrabold leading-tight tracking-tight">{result.title}</h2>
            </div>

            <div className="rounded-2xl border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/[0.06] p-4">
              <ol className="space-y-2.5">
                {result.moves.map((m, i) => (
                  <li key={i} className="flex items-baseline gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-[var(--color-primary)] text-white text-[12px] font-black flex items-center justify-center translate-y-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <span className="font-bold text-[14.5px]">{m.name}</span>
                      <span className="text-white/60 text-[13.5px]"> — {m.prescription}</span>
                    </div>
                  </li>
                ))}
              </ol>
              {result.note && (
                <p className="mt-3.5 pt-3 border-t border-white/10 text-[13px] text-white/65 leading-relaxed">
                  {result.note}
                </p>
              )}
            </div>

            <ExerciseGuide items={result.guide} />

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setResult(null)}
                className="flex-1 h-12 rounded-full border border-white/15 bg-white/[0.06] text-white/85 text-[13px] font-bold"
              >
                New break
              </button>
              <button
                type="button"
                onClick={go}
                disabled={pending}
                className="flex-1 h-12 rounded-full brand-gradient text-white text-[13px] font-bold disabled:opacity-60"
              >
                {pending ? 'Building…' : 'Regenerate'}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
