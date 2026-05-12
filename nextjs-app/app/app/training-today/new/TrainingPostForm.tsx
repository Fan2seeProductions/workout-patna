// Client form for Training Today posts.
'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createTrainingPost, type TrainingLookingFor } from '../../../../lib/actions/training-today'

const LOOKING_FOR: { id: TrainingLookingFor; label: string }[] = [
  { id: 'spotter',          label: 'Spotter' },
  { id: 'accountability',   label: 'Accountability partner' },
  { id: 'cardio',           label: 'Cardio partner' },
  { id: 'beginner_friendly',label: 'Beginner-friendly partner' },
  { id: 'group',            label: 'Group workout' },
  { id: 'trainer',          label: 'Trainer support' },
]

const WORKOUT_TYPES = [
  'Push', 'Pull', 'Legs', 'Upper body', 'Full body',
  'Run', 'HIIT', 'Yoga', 'Mobility', 'Boxing', 'Cardio',
]

export function TrainingPostForm({
  gyms,
  defaultGymId,
}: {
  gyms: { id: string; name: string; type: string; city: string }[]
  defaultGymId: string | null
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [gymId, setGymId] = useState<string>(defaultGymId ?? gyms[0]?.id ?? '')
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState<string>('18:00')
  const [workoutType, setWorkoutType] = useState<string>('Push')
  const [notes, setNotes] = useState('')
  const [lookingFor, setLookingFor] = useState<Set<TrainingLookingFor>>(new Set(['accountability']))
  const [gymQuery, setGymQuery] = useState('')

  const filteredGyms = useMemo(() => {
    const q = gymQuery.trim().toLowerCase()
    if (!q) return gyms.slice(0, 30)
    return gyms.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.city.toLowerCase().includes(q),
    ).slice(0, 30)
  }, [gyms, gymQuery])

  function toggle(id: TrainingLookingFor) {
    setLookingFor(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const startsAt = new Date(`${date}T${time}:00`)
    start(async () => {
      const res = await createTrainingPost({
        gym_id: gymId,
        starts_at: startsAt.toISOString(),
        workout_type: workoutType,
        notes,
        looking_for: [...lookingFor],
      })
      if (!res.ok) {
        setError(res.error ?? 'Could not post.')
        return
      }
      router.push('/app/discover?tab=Training+Today')
    })
  }

  return (
    <main className="min-h-dvh px-5 pt-6 pb-16 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link href="/app/discover" className="text-[13px] font-bold text-[var(--color-primary)]">
          ← Back
        </Link>
        <span className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)]">
          Post Training Today
        </span>
        <span className="w-10" />
      </div>

      <h1 className="text-[26px] font-extrabold tracking-tight text-[var(--color-foreground)]">
        When and where will you train?
      </h1>
      <p className="mt-1 text-[13px] text-[var(--color-muted-foreground)]">
        Other Partnas at your gym will see this and can join you.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-5">
        {/* Gym */}
        <Field label="Location">
          <input
            value={gymQuery}
            onChange={e => setGymQuery(e.target.value)}
            placeholder="Search by gym name or city"
            className={inputCls}
          />
          <select
            value={gymId}
            onChange={e => setGymId(e.target.value)}
            required
            className={`${inputCls} mt-2`}
          >
            {filteredGyms.length === 0 && <option value="">No matching gyms</option>}
            {filteredGyms.map(g => (
              <option key={g.id} value={g.id}>{g.name} {g.city ? `· ${g.city}` : ''}</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Date">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className={inputCls}
            />
          </Field>
          <Field label="Time">
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Workout type">
          <div className="flex flex-wrap gap-1.5">
            {WORKOUT_TYPES.map(w => (
              <button
                type="button"
                key={w}
                onClick={() => setWorkoutType(w)}
                className={`px-3.5 py-2 rounded-full text-[12.5px] font-medium border transition ${
                  workoutType === w
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/15 text-[var(--color-primary)]'
                    : 'border-white/15 bg-white/[0.04] text-white/85 hover:bg-white/[0.08]'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Looking for">
          <div className="flex flex-wrap gap-1.5">
            {LOOKING_FOR.map(l => {
              const on = lookingFor.has(l.id)
              return (
                <button
                  type="button"
                  key={l.id}
                  onClick={() => toggle(l.id)}
                  className={`px-3.5 py-2 rounded-full text-[12.5px] font-medium border transition ${
                    on
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/15 text-[var(--color-primary)]'
                      : 'border-white/15 bg-white/[0.04] text-white/85 hover:bg-white/[0.08]'
                  }`}
                >
                  {l.label}
                </button>
              )
            })}
          </div>
        </Field>

        <Field label="Notes (optional)">
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value.slice(0, 200))}
            rows={3}
            placeholder="Training legs tonight at 6:30 PM. Looking for a serious push partner."
            className={`${inputCls} resize-none`}
          />
        </Field>

        {error && (
          <p className="text-[13px] text-[var(--color-destructive)]">{error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full h-12 rounded-full brand-gradient text-white font-bold text-[15px] shadow-glow disabled:opacity-50"
        >
          {pending ? 'Posting...' : 'Post Training Today'}
        </button>
      </form>
    </main>
  )
}

const inputCls =
  'w-full h-11 rounded-xl border border-white/10 bg-[#1a1a1a] px-3.5 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)] mb-1.5">{label}</p>
      {children}
    </div>
  )
}
