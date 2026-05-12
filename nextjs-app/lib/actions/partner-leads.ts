// Server action for the partner lead form on /for-gyms-apartments.
'use server'

import { createClient } from '../supabase/server'
import { notifyIntake } from '../email/intake-notify'

export type PartnerLeadInput = {
  name: string
  email: string
  phone?: string
  organization: string
  location_type:
    | 'apartment_community'
    | 'gym'
    | 'fitness_center'
    | 'hoa'
    | 'community_center'
    | 'corporate_wellness'
    | 'other'
  member_count?: string
  city?: string
  state?: string
  message?: string
}

const REQUIRED_TYPES = new Set([
  'apartment_community','gym','fitness_center','hoa',
  'community_center','corporate_wellness','other',
])

export async function submitPartnerLead(input: PartnerLeadInput) {
  // Basic validation
  const name = input.name?.trim()
  const email = input.email?.trim()
  const organization = input.organization?.trim()
  if (!name || !email || !organization) {
    return { ok: false, error: 'Please fill in name, email, and organization.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }
  if (!REQUIRED_TYPES.has(input.location_type)) {
    return { ok: false, error: 'Please choose a location type.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('partner_leads').insert({
    name,
    email,
    phone: input.phone?.trim() || null,
    organization,
    location_type: input.location_type,
    member_count: input.member_count?.trim() || null,
    city: input.city?.trim() || null,
    state: input.state?.trim() || null,
    message: input.message?.trim() || null,
    source: 'for-gyms-apartments',
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  // Best-effort email notification — emails sales@ + info@ via the
  // shared intake-notify helper. No-ops when RESEND_API_KEY isn't set.
  await notifyIntake({
    kind: `Partner lead (${input.location_type})`,
    category: 'partners',
    who: `${name} · ${organization}`,
    replyTo: email,
    fields: [
      { label: 'Name', value: name },
      { label: 'Email', value: email },
      { label: 'Phone', value: input.phone ?? null },
      { label: 'Organization', value: organization },
      { label: 'Type', value: input.location_type },
      { label: 'Members / Residents', value: input.member_count ?? null },
      { label: 'Location', value: [input.city, input.state].filter(Boolean).join(', ') || null },
      { label: 'Message', value: input.message ?? null },
    ],
  })

  return { ok: true }
}
