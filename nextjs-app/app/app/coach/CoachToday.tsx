// Redesigned "Today" screen — full-bleed hero workout view (Gymverse/Centr
// style): photo hero with overlaid controls, big title, icon metadata rows,
// description, and a pinned white "Start workout" CTA. Tapping Start reveals
// the full session (warm-up / main / finisher / notes) with Done / Skip /
// Swap actions wired to the existing coach server actions.
'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { markWorkoutFeedback, regenerateTodayWorkout } from '../../../lib/actions/coach'
import { ExerciseGuide, type GuideItem } from '../../../components/app/ExerciseGuide'

type Workout = {
  id: string
  focus: string | null
  warm_up: string | null
  main: string | null
  finisher: string | null
  notes: string | null
  feedback: string | null
}

type Meta = {
  minutes: number
  level: string
  equipment: string
  activity: string
  dateLabel: string
  streak: number
}

function Icon({ name }: { name: 'clock' | 'activity' | 'gear' | 'screen' | 'back' | 'bookmark' | 'dots' | 'swap' | 'check' }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'clock': return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
    case 'activity': return <svg {...common}><path d="M12 5v4l3 2" /><circle cx="12" cy="4" r="1.6" /><path d="M5 21l3-7 4 2 2-3 3 5 4-3" /></svg>
    case 'gear': return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1l-.3-2.5h-4l-.3 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5a7 7 0 0 0 .1-1z" /></svg>
    case 'screen': return <svg {...common}><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
    case 'back': return <svg {...common}><path d="M15 18l-6-6 6-6" /></svg>
    case 'bookmark': return <svg {...common}><path d="M6 4h12v16l-6-4-6 4z" /></svg>
    case 'dots': return <svg {...common}><circle cx="5" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="19" cy="12" r="1.4" /></svg>
    case 'swap': return <svg {...common}><path d="M3 12a9 9 0 0 1 15-6.7M21 4v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7M3 20v-5h5" /></svg>
    case 'check': return <svg {...common}><path d="M5 12l5 5L20 6" /></svg>
  }
}

const QUICK_REASONS = [
  { label: 'Too sore', value: "I'm sore, give me a lighter session" },
  { label: 'Short on time', value: 'I only have 20 minutes today' },
  { label: 'Different focus', value: 'I want to train a different body part today' },
  { label: 'Limited gear', value: 'I only have dumbbells and a bench' },
]

export function CoachToday({
  workout,
  meta,
  heroSrc,
  guide = [],
}: {
  workout: Workout
  meta: Meta
  heroSrc: string
  guide?: GuideItem[]
}) {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(workout.feedback === 'completed')
  const [swapOpen, setSwapOpen] = useState(false)
  const [swapReason, setSwapReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  const title = workout.focus || "Today's workout"

  function finish(kind: 'completed' | 'skipped') {
    start(async () => {
      await markWorkoutFeedback(workout.id, kind)
      setDone(kind === 'completed')
      router.refresh()
    })
  }

  function swap(text: string) {
    setError(null)
    start(async () => {
      const res = await regenerateTodayWorkout(text)
      if (!res.ok) {
        setError(res.error ?? 'Could not swap. Try again.')
        return
      }
      setSwapOpen(false)
      setSwapReason('')
      setStarted(false)
      router.refresh()
    })
  }

  // ── Active session view ───────────────────────────────────────────────
  if (started) {
    return (
      <main className="min-h-dvh bg-[var(--color-background)] text-white pb-32">
        <header className="sticky top-0 z-30 bg-[var(--color-background)]/90 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-md mx-auto px-4 h-14 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStarted(false)}
              aria-label="Back"
              className="h-9 w-9 rounded-full bg-white/[0.06] flex items-center justify-center text-white/85"
            >
              <Icon name="back" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-brand-bright)]">In session</p>
              <h1 className="font-bold text-[15px] truncate">{title}</h1>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto px-5 py-5 space-y-3">
          <SessionBlock n="1" label="Warm-up" body={workout.warm_up} />
          <SessionBlock n="2" label="Main workout" body={workout.main} accent />
          {workout.finisher?.trim() && <SessionBlock n="3" label="Finisher" body={workout.finisher} />}

          <ExerciseGuide items={guide} />
          {workout.notes?.trim() && (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-[11px] uppercase font-bold tracking-wider text-white/45 mb-1.5">Coach notes</p>
              <p className="text-[14px] text-white/75 leading-relaxed whitespace-pre-line">{workout.notes}</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setSwapOpen(v => !v)}
            className="w-full h-11 rounded-full border border-white/12 bg-white/[0.04] text-white/80 text-[13px] font-bold hover:bg-white/[0.08] transition flex items-center justify-center gap-2"
          >
            <Icon name="swap" /> Swap this workout
          </button>

          {swapOpen && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {QUICK_REASONS.map(r => (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => swap(r.value)}
                    disabled={pending}
                    className="h-10 px-3 rounded-full border border-white/15 bg-white/[0.04] text-white/85 text-[12px] font-semibold hover:bg-white/[0.08] transition disabled:opacity-50"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <textarea
                value={swapReason}
                onChange={e => setSwapReason(e.target.value)}
                placeholder="Or describe it — e.g. shoulder is acting up, skip overhead work"
                maxLength={200}
                rows={2}
                disabled={pending}
                className="w-full rounded-xl border border-white/10 bg-[#161616] p-3 text-[13px] text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--color-brand)] resize-none"
              />
              <button
                type="button"
                onClick={() => swap(swapReason)}
                disabled={pending || swapReason.trim().length < 3}
                className="w-full h-11 rounded-full brand-gradient text-white font-bold text-[13px] disabled:opacity-50"
              >
                {pending ? 'Generating…' : 'Generate new workout'}
              </button>
            </div>
          )}

          {error && <p className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-2">{error}</p>}
        </div>

        {/* Pinned finish bar */}
        <div className="fixed bottom-0 inset-x-0 z-40 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/95 to-transparent pt-6 pb-[calc(env(safe-area-inset-bottom)+16px)]">
          <div className="max-w-md mx-auto px-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => finish('skipped')}
              disabled={pending}
              className="h-14 px-5 rounded-full border border-white/15 bg-white/[0.06] text-white/80 font-bold text-[14px] disabled:opacity-50"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={() => finish('completed')}
              disabled={pending}
              className="flex-1 h-14 rounded-full bg-white text-black font-extrabold text-[16px] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Icon name="check" /> {done ? 'Completed' : 'Mark complete'}
            </button>
          </div>
        </div>
      </main>
    )
  }

  // ── Intro / hero view ─────────────────────────────────────────────────
  return (
    <main className="relative min-h-dvh bg-[var(--color-background)] text-white pb-32">
      {/* Hero photo */}
      <div className="absolute inset-x-0 top-0 h-[56vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroSrc} alt="" aria-hidden className="h-full w-full object-cover object-[60%_30%]" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(13,13,13,0.45) 0%, rgba(13,13,13,0.15) 35%, rgba(13,13,13,0.85) 80%, var(--color-background) 100%)' }} />
      </div>

      {/* Top controls */}
      <header className="relative z-20 max-w-md mx-auto px-4 pt-[calc(env(safe-area-inset-top)+12px)] flex items-center justify-between">
        <Link href="/app/coach" aria-label="Back" className="h-10 w-10 rounded-full bg-black/35 backdrop-blur flex items-center justify-center text-white">
          <Icon name="back" />
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/app/coach/intake" aria-label="Edit plan" className="h-10 w-10 rounded-full bg-black/35 backdrop-blur flex items-center justify-center text-white">
            <Icon name="gear" />
          </Link>
          <Link href="/app/profile" aria-label="Profile" className="h-10 w-10 rounded-full bg-black/35 backdrop-blur flex items-center justify-center text-white">
            <Icon name="dots" />
          </Link>
        </div>
      </header>

      {/* Title + meta, pushed below the hero focal point */}
      <div className="relative z-10 max-w-md mx-auto px-5 pt-[40vh]">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--color-brand-bright)]">
          {meta.dateLabel}{meta.streak > 0 ? ` · ${meta.streak} day streak` : ''}
        </p>
        <h1 className="mt-1.5 text-[34px] font-extrabold leading-[1.05] tracking-tight">{title}</h1>

        <div className="mt-6 space-y-3.5">
          <MetaRow icon="clock" text={`${meta.minutes} mins, ${meta.level}`} />
          <MetaRow icon="activity" text={meta.activity} />
          <MetaRow icon="gear" text={meta.equipment} />
          <MetaRow icon="screen" text="AI Coach plan" />
        </div>

        <Link
          href="/app/coach/desk"
          className="mt-6 inline-flex items-center gap-2 h-10 px-5 rounded-full border border-white/15 bg-white/[0.06] text-white/85 text-[13px] font-bold hover:bg-white/[0.1] transition"
        >
          🪑 Stuck at your desk? Get a 5-min break workout →
        </Link>

        {workout.notes?.trim() && (
          <p className="mt-6 text-[15px] text-white/65 leading-relaxed">{workout.notes}</p>
        )}
      </div>

      {/* Pinned start bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/95 to-transparent pt-8 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <div className="max-w-md mx-auto px-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="flex-1 h-14 rounded-full bg-white text-black font-extrabold text-[16px]"
          >
            {done ? 'Review workout' : 'Start workout'}
          </button>
          <button
            type="button"
            onClick={() => { setStarted(true); setSwapOpen(true) }}
            aria-label="Swap workout"
            className="h-14 w-14 rounded-full border border-white/15 bg-white/[0.06] flex items-center justify-center text-white/85"
          >
            <Icon name="swap" />
          </button>
        </div>
      </div>
    </main>
  )
}

function MetaRow({ icon, text }: { icon: 'clock' | 'activity' | 'gear' | 'screen'; text: string }) {
  return (
    <div className="flex items-center gap-3.5 text-white/90">
      <span className="text-white/55 shrink-0"><Icon name={icon} /></span>
      <span className="text-[16px] font-medium">{text}</span>
    </div>
  )
}

function SessionBlock({ n, label, body, accent = false }: { n: string; label: string; body: string | null; accent?: boolean }) {
  if (!body) return null
  return (
    <div className={`rounded-2xl border p-4 ${accent ? 'border-[var(--color-brand)]/40 bg-[var(--color-brand)]/[0.06]' : 'border-white/[0.08] bg-white/[0.03]'}`}>
      <div className="flex items-center gap-2.5 mb-2">
        <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[12px] font-black ${accent ? 'bg-[var(--color-brand)] text-white' : 'bg-white/10 text-white/80'}`}>{n}</span>
        <p className="text-[12px] uppercase font-bold tracking-wider text-white/70">{label}</p>
      </div>
      <p className="text-[14px] text-white/85 leading-relaxed whitespace-pre-line">{body}</p>
    </div>
  )
}
