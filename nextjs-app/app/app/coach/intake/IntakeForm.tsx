// Multi-section intake. Saves on submit, then redirects to /app/coach.
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveIntake } from '../../../../lib/actions/coach'
import { BackIcon, BrainIcon } from '../../../../components/app/icons'

type Initial = {
  goals?: string[] | null
  fitness_level?: string | null
  days_per_week?: number | null
  workout_minutes?: number | null
  equipment?: string[] | null
  injuries?: string | null
  target_areas?: string[] | null
  training_style?: string | null
  delivery_time?: string | null
  coaching_tone?: string | null
} | null

const GOALS = ['Build Muscle','Lose Weight','Get Stronger','Endurance','Flexibility','Sport-specific']
const LEVELS = ['Beginner','Intermediate','Advanced','Athlete']
const EQUIPMENT = ['Full Gym','Dumbbells','Barbell','Bodyweight','Bands','Pull-up bar','Treadmill','Kettlebell']
const AREAS = ['Legs','Upper body','Core','Glutes','Back','Arms','Cardio']
const STYLES = ['strength','hypertrophy','endurance','mixed'] as const
const TONES = ['encouraging','tough','clinical'] as const
const TIMES = ['06:00','07:00','08:00','12:00','17:00','18:00','19:00','21:00']

export function IntakeForm({ initial }: { initial: Initial }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [goals, setGoals] = useState(new Set(initial?.goals ?? []))
  const [level, setLevel] = useState(initial?.fitness_level ?? '')
  const [days, setDays] = useState(initial?.days_per_week ?? 3)
  const [minutes, setMinutes] = useState(initial?.workout_minutes ?? 45)
  const [equipment, setEquipment] = useState(new Set(initial?.equipment ?? ['Full Gym']))
  const [areas, setAreas] = useState(new Set(initial?.target_areas ?? []))
  const [style, setStyle] = useState<typeof STYLES[number]>((initial?.training_style as typeof STYLES[number]) ?? 'mixed')
  const [tone, setTone] = useState<typeof TONES[number]>((initial?.coaching_tone as typeof TONES[number]) ?? 'encouraging')
  const [time, setTime] = useState(initial?.delivery_time ?? '07:00')
  const [injuries, setInjuries] = useState(initial?.injuries ?? '')

  const toggle = (s: Set<string>, v: string, fn: (s: Set<string>) => void) => {
    const n = new Set(s)
    n.has(v) ? n.delete(v) : n.add(v)
    fn(n)
  }

  function submit() {
    setError(null)
    start(async () => {
      const res = await saveIntake({
        goals: [...goals],
        fitness_level: level || undefined,
        days_per_week: days,
        workout_minutes: minutes,
        equipment: [...equipment],
        target_areas: [...areas],
        training_style: style,
        coaching_tone: tone,
        delivery_time: time,
        injuries: injuries.trim() || undefined,
      })
      if (!res.ok) {
        setError(res.error ?? 'Save failed.')
        return
      }
      router.push('/app/coach')
    })
  }

  const canSubmit = goals.size > 0 && !!level && equipment.size > 0

  return (
    <main className="min-h-dvh px-6 pt-6 pb-32 max-w-md mx-auto">
      <header className="flex items-center justify-between">
        <Link
          href="/app/coach"
          aria-label="Back"
          className="h-9 w-9 rounded-full border border-[var(--color-border)] bg-white/[0.04] flex items-center justify-center text-white/85"
        >
          <BackIcon width={18} height={18} />
        </Link>
        <span className="w-9" />
      </header>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-[var(--color-cyan)]/15 border border-[var(--color-cyan)]/30 flex items-center justify-center text-[var(--color-cyan)]">
          <BrainIcon width={22} height={22} />
        </div>
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight">AI Coach intake</h1>
          <p className="text-[12px] text-[var(--color-text-muted)]">3 minutes. We'll build your daily plan.</p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <Field label="Goals">
          <Pills options={GOALS} selected={goals} onClick={v => toggle(goals, v, setGoals)} />
        </Field>

        <Field label="Fitness level">
          <Pills options={LEVELS} selected={new Set(level ? [level] : [])} onClick={setLevel} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Days / week">
            <SliderRow value={days} setValue={setDays} min={2} max={7} />
          </Field>
          <Field label="Minutes / session">
            <SliderRow value={minutes} setValue={setMinutes} min={20} max={120} step={5} suffix="m" />
          </Field>
        </div>

        <Field label="Equipment">
          <Pills options={EQUIPMENT} selected={equipment} onClick={v => toggle(equipment, v, setEquipment)} />
        </Field>

        <Field label="Target areas">
          <Pills options={AREAS} selected={areas} onClick={v => toggle(areas, v, setAreas)} />
        </Field>

        <Field label="Training style">
          <Pills options={[...STYLES] as string[]} selected={new Set([style])} onClick={v => setStyle(v as typeof STYLES[number])} />
        </Field>

        <Field label="Coaching tone">
          <Pills options={[...TONES] as string[]} selected={new Set([tone])} onClick={v => setTone(v as typeof TONES[number])} />
        </Field>

        <Field label="Daily text time">
          <Pills options={TIMES} selected={new Set([time])} onClick={setTime} />
        </Field>

        <Field label="Injuries or limitations">
          <textarea
            value={injuries}
            onChange={e => setInjuries(e.target.value.slice(0, 300))}
            rows={2}
            placeholder="e.g., bad left knee, no deadlifts"
            className="w-full rounded-xl border border-[var(--color-border)] bg-white/[0.04] p-3 text-[14px] text-white placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-brand)] resize-none"
          />
        </Field>

        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit || pending}
          className="w-full h-12 rounded-full brand-gradient text-white font-semibold text-[15px] disabled:opacity-50"
        >
          {pending ? 'Saving...' : initial ? 'Save changes' : "I'm ready, build my plan"}
        </button>
        {error && <p className="text-[12px] text-[var(--color-danger)] text-center">{error}</p>}
      </div>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-text-muted)] mb-2">
        {label}
      </p>
      {children}
    </div>
  )
}

function Pills({
  options, selected, onClick,
}: {
  options: string[]
  selected: Set<string>
  onClick: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const on = selected.has(o)
        return (
          <button
            key={o}
            type="button"
            onClick={() => onClick(o)}
            className={`px-3.5 py-2 rounded-full text-[13px] font-medium border transition capitalize ${
              on
                ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/15 text-[var(--color-brand-bright)]'
                : 'border-[var(--color-border)] bg-white/[0.03] text-white/85 hover:border-[var(--color-border-bright)]'
            }`}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

function SliderRow({
  value, setValue, min, max, step = 1, suffix = '',
}: {
  value: number
  setValue: (n: number) => void
  min: number
  max: number
  step?: number
  suffix?: string
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white/[0.04] p-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setValue(Math.max(min, value - step))}
          className="h-8 w-8 rounded-full bg-white/[0.06] text-white text-[18px] leading-none"
        >
          −
        </button>
        <span className="font-bold text-[18px]">
          {value}{suffix}
        </span>
        <button
          type="button"
          onClick={() => setValue(Math.min(max, value + step))}
          className="h-8 w-8 rounded-full bg-white/[0.06] text-white text-[18px] leading-none"
        >
          +
        </button>
      </div>
    </div>
  )
}
