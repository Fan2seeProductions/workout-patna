// Feedback chips beneath today's AI workout. Lets coach adjust tomorrow.
'use client'

import { useState, useTransition } from 'react'
import { markWorkoutFeedback } from '../../../lib/actions/coach'
import { CheckIcon } from '../../../components/app/icons'

const options: { id: 'completed' | 'too_easy' | 'too_hard' | 'sore' | 'skipped'; label: string }[] = [
  { id: 'completed', label: 'Completed ✓' },
  { id: 'too_easy',  label: 'Too easy' },
  { id: 'too_hard',  label: 'Too hard' },
  { id: 'sore',      label: 'Sore' },
  { id: 'skipped',   label: 'Skipped' },
]

export function WorkoutFeedback({
  workoutId,
  current,
}: {
  workoutId: string
  current: string | null
}) {
  const [active, setActive] = useState<string | null>(current)
  const [pending, start] = useTransition()

  function pick(id: typeof options[number]['id']) {
    setActive(id)
    start(async () => { await markWorkoutFeedback(workoutId, id) })
  }

  return (
    <section className="glass-card p-4">
      <p className="text-[12px] uppercase font-bold tracking-wider text-[var(--color-text-muted)] mb-2.5">
        How was today?
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map(o => {
          const on = active === o.id
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => pick(o.id)}
              disabled={pending}
              className={`px-3.5 py-2 rounded-full text-[13px] font-medium border transition disabled:opacity-50 inline-flex items-center gap-1.5 ${
                on
                  ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/15 text-[var(--color-brand-bright)]'
                  : 'border-[var(--color-border)] bg-white/[0.03] text-white/85 hover:border-[var(--color-border-bright)]'
              }`}
            >
              {on && <CheckIcon width={12} height={12} />}
              {o.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
