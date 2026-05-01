// Editable profile settings card.
'use client'

import { useState, useTransition } from 'react'
import { PhotoUploader } from '../../../../components/app/PhotoUploader'
import { updateMyProfile } from '../../../../lib/actions/profile'

type Profile = {
  id: string
  display_name?: string | null
  age?: number | null
  bio?: string | null
  fitness_level?: string | null
  goals?: string[] | null
  styles?: string[] | null
  schedule_days?: string[] | null
  schedule_times?: string[] | null
  primary_location?: string | null
  photo_url?: string | null
}

const LEVELS = ['Beginner','Intermediate','Advanced','Athlete']
const GOALS = ['Build Muscle','Lose Weight','Get Stronger','Stay Consistent','Endurance','Flexibility','Mental Health','Sport-specific']
const STYLES = ['Strength','HIIT','Cardio','Yoga','Run','Boxing','Calisthenics','CrossFit']
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const TIMES = ['Mornings','Midday','Evenings','Late night']

export function ProfileSettings({ profile, email }: { profile: Profile; email: string }) {
  const [displayName, setDisplayName] = useState(profile.display_name ?? '')
  const [age, setAge] = useState<string>(profile.age?.toString() ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [location, setLocation] = useState(profile.primary_location ?? '')
  const [level, setLevel] = useState(profile.fitness_level ?? '')
  const [goals, setGoals] = useState(new Set(profile.goals ?? []))
  const [styles, setStyles] = useState(new Set(profile.styles ?? []))
  const [days, setDays] = useState(new Set(profile.schedule_days ?? []))
  const [times, setTimes] = useState(new Set(profile.schedule_times ?? []))
  const [pending, start] = useTransition()
  const [saved, setSaved] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const toggle = (set: Set<string>, val: string, setFn: (s: Set<string>) => void) => {
    const next = new Set(set)
    next.has(val) ? next.delete(val) : next.add(val)
    setFn(next)
  }

  function save() {
    setSaved('saving')
    setErrorMsg(null)
    const ageNum = age.trim() ? parseInt(age, 10) : null
    start(async () => {
      const res = await updateMyProfile({
        display_name: displayName.trim() || undefined,
        age: ageNum,
        bio: bio.trim(),
        primary_location: location.trim(),
        fitness_level: level || undefined,
        goals: [...goals],
        styles: [...styles],
        schedule_days: [...days],
        schedule_times: [...times],
      })
      if (res.ok) {
        setSaved('saved')
        setTimeout(() => setSaved('idle'), 2000)
      } else {
        setSaved('error')
        setErrorMsg(res.error ?? 'Save failed.')
      }
    })
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <PhotoUploader initialPhotoUrl={profile.photo_url} size={88} />
        <div className="min-w-0 flex-1">
          <h1 className="text-[20px] font-extrabold tracking-tight">Your profile</h1>
          <p className="text-[12px] text-[var(--color-text-muted)] truncate">{email}</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <Field label="Display name">
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="What do friends call you?"
            className="w-full h-11 rounded-xl border border-[var(--color-border)] bg-white/[0.04] px-3.5 text-[14px] text-white placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-brand)]"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Age">
            <input
              type="number"
              min={13}
              max={99}
              value={age}
              onChange={e => setAge(e.target.value)}
              className="w-full h-11 rounded-xl border border-[var(--color-border)] bg-white/[0.04] px-3.5 text-[14px] text-white focus:outline-none focus:border-[var(--color-brand)]"
            />
          </Field>
          <Field label="Primary location">
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="EOS Cypress"
              className="w-full h-11 rounded-xl border border-[var(--color-border)] bg-white/[0.04] px-3.5 text-[14px] text-white placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-brand)]"
            />
          </Field>
        </div>

        <Field label="Bio">
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value.slice(0, 200))}
            rows={3}
            placeholder="What gets you in the gym?"
            className="w-full rounded-xl border border-[var(--color-border)] bg-white/[0.04] p-3 text-[14px] text-white placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-brand)] resize-none"
          />
          <p className="text-right text-[10px] text-[var(--color-text-dim)] mt-1">{bio.length}/200</p>
        </Field>

        <Field label="Fitness level">
          <Pills options={LEVELS} selected={level ? new Set([level]) : new Set()} onClick={setLevel} single />
        </Field>

        <Field label="Goals">
          <Pills options={GOALS} selected={goals} onClick={v => toggle(goals, v, setGoals)} />
        </Field>

        <Field label="Workout style">
          <Pills options={STYLES} selected={styles} onClick={v => toggle(styles, v, setStyles)} />
        </Field>

        <Field label="Schedule">
          <div className="grid grid-cols-7 gap-1.5">
            {DAYS.map(d => {
              const on = days.has(d)
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggle(days, d, setDays)}
                  className={`h-11 rounded-xl text-[11px] font-semibold border transition ${
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
            <Pills options={TIMES} selected={times} onClick={v => toggle(times, v, setTimes)} />
          </div>
        </Field>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={pending}
        className="mt-6 w-full h-12 rounded-full brand-gradient text-white font-semibold text-[15px] disabled:opacity-50"
      >
        {pending ? 'Saving...' : saved === 'saved' ? 'Saved ✓' : 'Save changes'}
      </button>
      {errorMsg && <p className="mt-2 text-[12px] text-[var(--color-danger)] text-center">{errorMsg}</p>}
    </div>
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
