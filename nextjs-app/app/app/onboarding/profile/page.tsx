// Onboarding step 4: fitness profile (level, goals, schedule, vibe).
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingFrame } from '../../../../components/app/OnboardingFrame'
import { BrandButton } from '../../../../components/app/BrandButton'
import { PhotoUploader } from '../../../../components/app/PhotoUploader'
import { updateMyProfile } from '../../../../lib/actions/profile'

const levels = ['Beginner', 'Intermediate', 'Advanced', 'Athlete']
const goals = [
  'Build Muscle', 'Lose Weight', 'Get Stronger', 'Stay Consistent',
  'Endurance', 'Flexibility', 'Mental Health', 'Sport-specific',
]
const styles = ['Strength', 'HIIT', 'Cardio', 'Yoga', 'Run', 'Boxing', 'Calisthenics', 'CrossFit']
const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const times = ['Mornings', 'Midday', 'Evenings', 'Late night']
const vibes = [
  { id: 'workout',   title: 'Workout only',        subtitle: 'Show up, train, leave.' },
  { id: 'friends',   title: 'Workouts and friends', subtitle: 'Stay connected outside the gym.' },
  { id: 'community', title: 'Build community',      subtitle: 'Grow a crew that trains together.' },
]

export default function ProfilePage() {
  const router = useRouter()
  const [level, setLevel] = useState<string>('')
  const [goalSet, setGoalSet] = useState<Set<string>>(new Set())
  const [styleSet, setStyleSet] = useState<Set<string>>(new Set())
  const [daySet, setDaySet] = useState<Set<string>>(new Set())
  const [timeSet, setTimeSet] = useState<Set<string>>(new Set())
  const [vibe, setVibe] = useState<string>('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggle = (set: Set<string>, val: string, setFn: (s: Set<string>) => void) => {
    const next = new Set(set)
    next.has(val) ? next.delete(val) : next.add(val)
    setFn(next)
  }

  // Only level is hard-required; everything else the user can fill at their own pace
  const canContinue = !!level

  async function handleContinue() {
    if (!canContinue || saving) return
    setSaving(true)
    setError(null)
    try {
      const result = await updateMyProfile({
        fitness_level: level,
        goals: [...goalSet],
        styles: [...styleSet],
        schedule_days: [...daySet],
        schedule_times: [...timeSet],
        vibe: vibe || undefined,
        bio: bio || undefined,
      })
      if (!result.ok) {
        setError(result.error ?? 'Could not save. Please try again.')
        setSaving(false)
        return
      }
      router.push('/app/onboarding/coach-intake')
    } catch {
      setError('Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  return (
    <OnboardingFrame step={4} totalSteps={5} backHref="/app/onboarding/find-location">
      <div className="mt-2">
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight">
          Build your profile
        </h1>
        <p className="mt-1.5 text-[14px] text-[var(--color-text-muted)]">
          The more accurate, the better your matches.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <Group label="Photo">
          <div className="flex flex-col items-center">
            <PhotoUploader size={104} />
            <p className="mt-2 text-[11px] text-[var(--color-text-dim)]">
              Optional, but profiles with a photo get 4x more matches.
            </p>
          </div>
        </Group>

        <Group label="Fitness level *">
          <PillRow options={levels} selected={level ? new Set([level]) : new Set()} onClick={setLevel} single />
        </Group>

        <Group label="Goals">
          <PillRow
            options={goals}
            selected={goalSet}
            onClick={v => toggle(goalSet, v, setGoalSet)}
          />
        </Group>

        <Group label="Workout style">
          <PillRow
            options={styles}
            selected={styleSet}
            onClick={v => toggle(styleSet, v, setStyleSet)}
          />
        </Group>

        <Group label="Schedule">
          <div className="grid grid-cols-7 gap-1.5">
            {days.map(d => {
              const on = daySet.has(d)
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggle(daySet, d, setDaySet)}
                  className={`h-12 rounded-xl text-[11px] font-semibold border transition ${
                    on
                      ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/15 text-[var(--color-brand-bright)]'
                      : 'border-[var(--color-border)] bg-white/[0.03] text-white/70'
                  }`}
                >
                  {d}
                </button>
              )
            })}
          </div>
          <div className="mt-2.5">
            <PillRow
              options={times}
              selected={timeSet}
              onClick={v => toggle(timeSet, v, setTimeSet)}
            />
          </div>
        </Group>

        <Group label="What you're looking for">
          <div className="space-y-2">
            {vibes.map(v => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVibe(v.id)}
                className={`w-full p-3.5 rounded-2xl border text-left transition ${
                  vibe === v.id
                    ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10'
                    : 'border-[var(--color-border)] bg-white/[0.03]'
                }`}
              >
                <p className="font-semibold text-[14px]">{v.title}</p>
                <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">{v.subtitle}</p>
              </button>
            ))}
          </div>
        </Group>

        <Group label="Bio (optional)">
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value.slice(0, 200))}
            rows={3}
            placeholder="What gets you in the gym? What are you working toward?"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white/[0.04] p-3 text-[14px] text-white placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-brand)] resize-none"
          />
          <p className="text-right text-[11px] text-[var(--color-text-dim)] mt-1">
            {bio.length}/200
          </p>
        </Group>
      </div>

      {error && (
        <p className="mt-4 text-[13px] text-red-400 text-center">{error}</p>
      )}

      {!level && (
        <p className="mt-4 text-[12px] text-[var(--color-text-dim)] text-center">
          Select a fitness level to continue
        </p>
      )}

      <BrandButton
        size="lg"
        className="w-full mt-4 mb-2"
        disabled={!canContinue || saving}
        onClick={handleContinue}
      >
        {saving ? 'Saving…' : 'Continue'}
      </BrandButton>
    </OnboardingFrame>
  )
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[12px] uppercase font-bold tracking-wider text-[var(--color-text-muted)] mb-2.5">
        {label}
      </p>
      {children}
    </div>
  )
}

function PillRow({
  options, selected, onClick, single = false,
}: {
  options: string[]
  selected: Set<string>
  onClick: (v: string) => void
  single?: boolean
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
            className={`px-3.5 py-2 rounded-full text-[13px] font-medium border transition ${
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
