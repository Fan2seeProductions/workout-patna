// Lead-capture form for apartment leasing managers (and other property types).
'use client'

import { useState, useTransition } from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { submitBusinessLead } from '../../../lib/actions/business-leads'

export function ClaimForm() {
  const [pending, start] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    proposedName: '',
    contactName: '',
    contactRole: '',
    contactEmail: '',
    contactPhone: '',
    propertyType: 'apartment' as 'apartment' | 'gym' | 'community_center' | 'other',
    propertySize: '',
    city: '',
    state: 'TX',
    message: '',
  })

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    start(async () => {
      const res = await submitBusinessLead(form)
      if (!res.ok) {
        setError(res.error ?? 'Submission failed.')
        return
      }
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center text-[var(--color-foreground)]">
        <div className="h-14 w-14 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-[var(--color-accent)]" />
        </div>
        <h3 className="text-2xl font-bold font-display">You're in line.</h3>
        <p className="mt-3 text-[var(--color-muted-foreground)]">
          We'll email <strong>{form.contactEmail}</strong> within 1 business day to verify your property and walk you through next steps.
        </p>
        <p className="mt-4 text-xs text-[var(--color-muted-foreground)]">
          Talk to you soon. The WorkoutPartna team
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="bg-white text-[var(--color-foreground)] rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl">
      <Field label="Property name *">
        <input
          required
          value={form.proposedName}
          onChange={e => update('proposedName', e.target.value)}
          placeholder="e.g. Bridgeland Lakes Apartments"
          className={inputClass}
        />
      </Field>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="City">
          <input value={form.city} onChange={e => update('city', e.target.value)} placeholder="Cypress" className={inputClass} />
        </Field>
        <Field label="State">
          <input value={form.state} onChange={e => update('state', e.target.value)} placeholder="TX" className={inputClass} />
        </Field>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Property type">
          <select
            value={form.propertyType}
            onChange={e => update('propertyType', e.target.value as typeof form.propertyType)}
            className={`${inputClass} bg-white`}
          >
            <option value="apartment">Apartment community</option>
            <option value="gym">Gym</option>
            <option value="community_center">Community center</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Number of units (optional)">
          <input value={form.propertySize} onChange={e => update('propertySize', e.target.value)} placeholder="e.g. 240" className={inputClass} />
        </Field>
      </div>

      <div className="border-t border-[var(--color-border)] pt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-3">Your contact info</p>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Your name *">
              <input required value={form.contactName} onChange={e => update('contactName', e.target.value)} placeholder="Jamie Smith" className={inputClass} />
            </Field>
            <Field label="Your role">
              <input value={form.contactRole} onChange={e => update('contactRole', e.target.value)} placeholder="Property Manager" className={inputClass} />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Email *">
              <input required type="email" value={form.contactEmail} onChange={e => update('contactEmail', e.target.value)} placeholder="jamie@property.com" className={inputClass} />
            </Field>
            <Field label="Phone (optional)">
              <input value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} placeholder="(713) 555-0123" className={inputClass} />
            </Field>
          </div>
        </div>
      </div>

      <Field label="Anything we should know? (optional)">
        <textarea
          rows={3}
          value={form.message}
          onChange={e => update('message', e.target.value.slice(0, 500))}
          placeholder="What problem are you trying to solve? Resident retention? Amenity utilization? Other?"
          className={`${inputClass} resize-none`}
        />
      </Field>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-[var(--color-secondary)] text-white font-bold text-base py-4 rounded-xl hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {pending ? 'Submitting...' : <>Claim my property <ArrowRight className="w-4 h-4" /></>}
      </button>

      <p className="text-[11px] text-[var(--color-muted-foreground)] text-center">
        By submitting you agree to our <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a>.
      </p>
    </form>
  )
}

const inputClass = 'w-full px-4 py-3 border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] transition'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-[var(--color-foreground)] mb-1.5">{label}</span>
      {children}
    </label>
  )
}
