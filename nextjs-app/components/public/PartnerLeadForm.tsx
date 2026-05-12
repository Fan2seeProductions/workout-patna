// Partner lead form for /for-gyms-apartments. Submits to partner_leads table.
'use client'

import { useState, useTransition } from 'react'
import { submitPartnerLead, type PartnerLeadInput } from '../../lib/actions/partner-leads'

const LOCATION_TYPES: { value: PartnerLeadInput['location_type']; label: string }[] = [
  { value: 'apartment_community', label: 'Apartment community' },
  { value: 'gym',                 label: 'Gym' },
  { value: 'fitness_center',      label: 'Fitness center' },
  { value: 'hoa',                 label: 'HOA' },
  { value: 'community_center',    label: 'Community center' },
  { value: 'corporate_wellness',  label: 'Corporate wellness' },
  { value: 'other',               label: 'Other' },
]

export function PartnerLeadForm() {
  const [pending, start] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<PartnerLeadInput>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    location_type: 'apartment_community',
    member_count: '',
    city: '',
    state: '',
    message: '',
  })

  function update<K extends keyof PartnerLeadInput>(key: K, val: PartnerLeadInput[K]) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    start(async () => {
      const res = await submitPartnerLead(form)
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setError(res.error ?? 'Submission failed.')
      }
    })
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/40 p-6 text-center">
        <div className="text-4xl">🎉</div>
        <h3 className="mt-3 font-extrabold text-[18px] text-[var(--color-foreground)]">Thanks. We'll be in touch.</h3>
        <p className="mt-2 text-[14px] text-[var(--color-muted-foreground)] max-w-sm mx-auto">
          We'll reach out within 24 hours to schedule a demo and walk through partnership options for your community.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Your name" required>
          <input
            value={form.name}
            onChange={e => update('name', e.target.value)}
            required
            className={inputCls}
            placeholder="Jane Smith"
          />
        </Field>
        <Field label="Email" required>
          <input
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            required
            className={inputCls}
            placeholder="jane@property.com"
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Phone (optional)">
          <input
            type="tel"
            value={form.phone}
            onChange={e => update('phone', e.target.value)}
            className={inputCls}
            placeholder="(555) 555-5555"
          />
        </Field>
        <Field label="Organization name" required>
          <input
            value={form.organization}
            onChange={e => update('organization', e.target.value)}
            required
            className={inputCls}
            placeholder="Bridgeland Apartments"
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Type of location" required>
          <select
            value={form.location_type}
            onChange={e => update('location_type', e.target.value as PartnerLeadInput['location_type'])}
            required
            className={inputCls}
          >
            {LOCATION_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Members / residents (approx.)">
          <input
            value={form.member_count}
            onChange={e => update('member_count', e.target.value)}
            className={inputCls}
            placeholder="350"
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="City">
          <input
            value={form.city}
            onChange={e => update('city', e.target.value)}
            className={inputCls}
            placeholder="Cypress"
          />
        </Field>
        <Field label="State">
          <input
            value={form.state}
            onChange={e => update('state', e.target.value)}
            className={inputCls}
            placeholder="TX"
          />
        </Field>
      </div>

      <Field label="Message (optional)">
        <textarea
          value={form.message}
          onChange={e => update('message', e.target.value.slice(0, 500))}
          rows={4}
          className={`${inputCls} resize-none`}
          placeholder="Tell us about your community and what you're trying to solve."
        />
      </Field>

      {error && (
        <p className="rounded-xl bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/30 px-3 py-2 text-[13px] text-[var(--color-destructive)]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full h-12 rounded-full brand-gradient text-white font-bold text-[15px] shadow-glow disabled:opacity-50"
      >
        {pending ? 'Submitting...' : 'Request Partnership Info'}
      </button>

      <p className="text-center text-[11px] text-[var(--color-muted-foreground)]">
        We'll only contact you about WorkoutPartna partnership options. No spam.
      </p>
    </form>
  )
}

const inputCls =
  'w-full h-11 rounded-xl border border-[var(--color-border)] bg-white px-3.5 text-[14px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20'

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-[var(--color-foreground)] mb-1.5 inline-block">
        {label} {required && <span className="text-[var(--color-destructive)]">*</span>}
      </span>
      {children}
    </label>
  )
}
