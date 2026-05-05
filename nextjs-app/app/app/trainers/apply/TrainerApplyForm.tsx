// Trainer apply form. Saves a pending row in trainer_applications.
'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { submitTrainerApplication } from '../../../../lib/actions/trainer-applications'

type ExistingApp = {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  name: string
  bio: string | null
  specialties: string[] | null
  certifications: string | null
  years_experience: number | null
  gym_id: string | null
  booking_link: string | null
  photo_url: string | null
} | null

const SPECIALTY_OPTIONS = [
  'Strength', 'Hypertrophy', 'Powerlifting', 'CrossFit', 'HIIT',
  'Cardio', 'Run coaching', 'Yoga', 'Pilates', 'Mobility',
  'Boxing', 'Bodybuilding', 'Weight loss', 'Nutrition',
  'Senior fitness', 'Pre/post-natal',
]

export function TrainerApplyForm({
  existing,
  gyms,
  defaultName,
  defaultPhoto,
}: {
  existing: ExistingApp
  gyms: { id: string; name: string; city: string; state: string }[]
  defaultName: string
  defaultPhoto: string | null
}) {
  const [pending, start] = useTransition()
  const [submitted, setSubmitted] = useState(existing?.status === 'pending' || existing?.status === 'approved')
  const [error, setError] = useState<string | null>(null)

  const [name, setName]                 = useState(defaultName)
  const [bio, setBio]                   = useState(existing?.bio ?? '')
  const [specialties, setSpecialties]   = useState<Set<string>>(new Set(existing?.specialties ?? []))
  const [certifications, setCerts]      = useState(existing?.certifications ?? '')
  const [years, setYears]               = useState<string>(existing?.years_experience?.toString() ?? '')
  const [gymId, setGymId]               = useState<string>(existing?.gym_id ?? '')
  const [bookingLink, setBookingLink]   = useState(existing?.booking_link ?? '')
  const [photoUrl]                      = useState<string>(existing?.photo_url ?? defaultPhoto ?? '')
  const [gymQuery, setGymQuery]         = useState('')

  const filteredGyms = useMemo(() => {
    const q = gymQuery.trim().toLowerCase()
    if (!q) return gyms.slice(0, 30)
    return gyms.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.city.toLowerCase().includes(q),
    ).slice(0, 30)
  }, [gyms, gymQuery])

  function toggleSpecialty(s: string) {
    setSpecialties(prev => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    start(async () => {
      const res = await submitTrainerApplication({
        name,
        bio,
        specialties: [...specialties],
        certifications,
        years_experience: years ? parseInt(years, 10) : null,
        gym_id: gymId || null,
        booking_link: bookingLink,
        photo_url: photoUrl,
      })
      if (!res.ok) {
        setError(res.error ?? 'Could not submit.')
        return
      }
      setSubmitted(true)
    })
  }

  if (submitted && existing?.status === 'approved') {
    return (
      <Wrap>
        <div className="rounded-2xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/40 p-6 text-center">
          <p className="text-3xl">🎉</p>
          <h2 className="mt-2 font-extrabold text-[18px]">You're approved</h2>
          <p className="mt-1 text-[13px] text-[var(--color-muted-foreground)]">
            Your trainer profile is live in Find Partnas → Trainers.
          </p>
          <Link href="/app/discover?tab=Trainers" className="mt-4 inline-flex h-10 px-5 rounded-full brand-gradient text-white items-center font-bold text-[13px]">
            See your profile
          </Link>
        </div>
      </Wrap>
    )
  }

  if (submitted) {
    return (
      <Wrap>
        <div className="rounded-2xl bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/30 p-6 text-center">
          <p className="text-3xl">⏳</p>
          <h2 className="mt-2 font-extrabold text-[18px]">Application received</h2>
          <p className="mt-1 text-[13px] text-[var(--color-muted-foreground)]">
            We review credentials within 48 hours. We'll email you when your profile is approved.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 inline-flex h-10 px-5 rounded-full border border-[var(--color-border)] items-center font-bold text-[13px] text-[var(--color-foreground)]"
          >
            Edit application
          </button>
        </div>
      </Wrap>
    )
  }

  return (
    <Wrap>
      <h1 className="text-[26px] font-extrabold tracking-tight text-[var(--color-foreground)]">
        Apply as a Trainer
      </h1>
      <p className="mt-1 text-[13px] text-[var(--color-muted-foreground)]">
        Free during beta. Approval typically within 48 hours.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <Field label="Display name" required>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className={inputCls}
            placeholder="Coach Marcus J."
          />
        </Field>

        <Field label="Specialties (pick all that apply)">
          <div className="flex flex-wrap gap-1.5">
            {SPECIALTY_OPTIONS.map(s => {
              const on = specialties.has(s)
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSpecialty(s)}
                  className={`px-3.5 py-2 rounded-full text-[12.5px] font-medium border transition ${
                    on
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'border-[var(--color-border)] bg-white text-[var(--color-foreground)]/85'
                  }`}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </Field>

        <Field label="Bio">
          <textarea
            rows={4}
            value={bio}
            onChange={e => setBio(e.target.value.slice(0, 600))}
            className={`${inputCls} resize-none h-auto py-2.5`}
            placeholder="Who you train, your style, what people get from working with you."
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Years of experience">
            <input
              type="number"
              min={0}
              max={50}
              value={years}
              onChange={e => setYears(e.target.value)}
              className={inputCls}
              placeholder="5"
            />
          </Field>
          <Field label="Booking link (optional)">
            <input
              type="url"
              value={bookingLink}
              onChange={e => setBookingLink(e.target.value)}
              className={inputCls}
              placeholder="https://calendly.com/..."
            />
          </Field>
        </div>

        <Field label="Certifications">
          <textarea
            rows={2}
            value={certifications}
            onChange={e => setCerts(e.target.value.slice(0, 400))}
            className={`${inputCls} resize-none h-auto py-2.5`}
            placeholder="NASM CPT, Precision Nutrition L1, etc."
          />
        </Field>

        <Field label="Primary gym you serve">
          <input
            value={gymQuery}
            onChange={e => setGymQuery(e.target.value)}
            placeholder="Search by gym name or city"
            className={inputCls}
          />
          <select
            value={gymId}
            onChange={e => setGymId(e.target.value)}
            className={`${inputCls} mt-2`}
          >
            <option value="">Choose a gym</option>
            {filteredGyms.map(g => (
              <option key={g.id} value={g.id}>{g.name} {g.city ? `· ${g.city}` : ''}</option>
            ))}
          </select>
        </Field>

        {error && <p className="text-[13px] text-[var(--color-destructive)]">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full h-12 rounded-full brand-gradient text-white font-bold text-[15px] shadow-glow disabled:opacity-50"
        >
          {pending ? 'Submitting...' : 'Submit application'}
        </button>
      </form>
    </Wrap>
  )
}

const inputCls =
  'w-full h-11 rounded-xl border border-[var(--color-border)] bg-white px-3.5 text-[14px] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)]'

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh px-5 pt-6 pb-20 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link href="/trainers" className="text-[13px] font-bold text-[var(--color-primary)]">← Back</Link>
        <span className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)]">
          Trainer application
        </span>
        <span className="w-10" />
      </div>
      {children}
    </main>
  )
}

function Field({
  label, required, children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)] mb-1.5 inline-block">
        {label} {required && <span className="text-[var(--color-destructive)]">*</span>}
      </span>
      {children}
    </label>
  )
}
