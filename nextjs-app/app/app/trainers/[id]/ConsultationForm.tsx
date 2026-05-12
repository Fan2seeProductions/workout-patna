// Free consultation request form, posted to trainer_consultations.
'use client'

import { useState, useTransition } from 'react'
import { requestConsultation } from '../../../../lib/actions/consultations'

export function ConsultationForm({
  trainerId,
  bookingLink,
}: {
  trainerId: string
  bookingLink: string | null
}) {
  const [pending, start] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName]     = useState('')
  const [date, setDate]     = useState(() => new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10))
  const [time, setTime]     = useState('17:00')
  const [message, setMsg]   = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    start(async () => {
      const startsAt = new Date(`${date}T${time}:00`)
      const res = await requestConsultation({
        trainer_id: trainerId,
        preferred_at: startsAt.toISOString(),
        message,
        user_name: name,
      })
      if (!res.ok) {
        setError(res.error ?? 'Could not submit.')
        return
      }
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/40 p-5 text-center">
        <p className="text-[24px]">✅</p>
        <p className="mt-1 font-extrabold text-[15px] text-[var(--color-foreground)]">Request sent</p>
        <p className="mt-1 text-[12.5px] text-[var(--color-muted-foreground)]">
          Your trainer will reach out shortly to confirm.
        </p>
        {bookingLink && (
          <a href={bookingLink} target="_blank" rel="noreferrer"
             className="mt-3 inline-flex h-10 px-4 rounded-full border border-white/15 bg-white/[0.06] text-[12.5px] font-bold items-center text-white">
            Or book directly →
          </a>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
      <Field label="Your name">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="Jane Doe"
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Preferred date">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required className={inputCls} />
        </Field>
        <Field label="Time">
          <input type="time" value={time} onChange={e => setTime(e.target.value)} required className={inputCls} />
        </Field>
      </div>

      <Field label="What are you working on?">
        <textarea
          value={message}
          onChange={e => setMsg(e.target.value.slice(0, 400))}
          rows={3}
          placeholder="My goals, current routine, anything you should know"
          className={`${inputCls} resize-none`}
        />
      </Field>

      {error && <p className="text-[12.5px] text-[var(--color-destructive)]">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full h-11 rounded-full brand-gradient text-white font-bold text-[14px] shadow-glow disabled:opacity-50"
      >
        {pending ? 'Sending...' : 'Request Free Consultation'}
      </button>
    </form>
  )
}

const inputCls =
  'w-full h-11 rounded-xl border border-white/10 bg-[#1a1a1a] px-3.5 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)] mb-1.5 inline-block">{label}</span>
      {children}
    </label>
  )
}
