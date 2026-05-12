// Server action that captures inbound leads from apartment leasing managers
// (or gyms / community centers) interested in claiming/sponsoring their location.
'use server'

import { createClient } from '../supabase/server'
import { notifyIntake } from '../email/intake-notify'

export type LeadInput = {
  proposedName: string
  contactName: string
  contactRole?: string
  contactEmail: string
  contactPhone?: string
  propertyType: 'apartment' | 'gym' | 'community_center' | 'other'
  propertySize?: string
  city?: string
  state?: string
  message?: string
}

export async function submitBusinessLead(input: LeadInput) {
  if (!input.contactEmail?.trim() || !input.contactName?.trim() || !input.proposedName?.trim()) {
    return { ok: false, error: 'Name, email, and property name are required.' }
  }

  const supabase = await createClient()

  // Try to link to an existing gym row by name match
  const { data: existing } = await supabase
    .from('gyms')
    .select('id')
    .ilike('name', input.proposedName.trim())
    .maybeSingle()

  const { error } = await supabase.from('business_leads').insert({
    gym_id: existing?.id ?? null,
    proposed_name: input.proposedName.trim(),
    contact_name: input.contactName.trim(),
    contact_role: input.contactRole?.trim() || null,
    contact_email: input.contactEmail.trim().toLowerCase(),
    contact_phone: input.contactPhone?.trim() || null,
    property_type: input.propertyType,
    property_size: input.propertySize?.trim() || null,
    city: input.city?.trim() || null,
    state: input.state?.trim() || 'TX',
    message: input.message?.trim() || null,
    status: 'new',
  })

  if (error) return { ok: false, error: error.message }

  // If matched to an existing gym, mark it pending so it shows as "claim in review"
  if (existing?.id) {
    await supabase
      .from('gyms')
      .update({ claim_status: 'pending', claim_email: input.contactEmail.trim().toLowerCase() })
      .eq('id', existing.id)
  }

  // Notify sales@ + info@ via the shared intake helper.
  await notifyIntake({
    kind: `Business lead (${input.propertyType})`,
    category: 'partners',
    who: `${input.contactName.trim()} · ${input.proposedName.trim()}`,
    replyTo: input.contactEmail.trim(),
    fields: [
      { label: 'Property name', value: input.proposedName.trim() },
      { label: 'Type', value: input.propertyType },
      { label: 'Contact name', value: input.contactName.trim() },
      { label: 'Contact role', value: input.contactRole ?? null },
      { label: 'Contact email', value: input.contactEmail.trim() },
      { label: 'Contact phone', value: input.contactPhone ?? null },
      { label: 'Property size', value: input.propertySize ?? null },
      { label: 'Location', value: [input.city, input.state].filter(Boolean).join(', ') || null },
      { label: 'Message', value: input.message ?? null },
      { label: 'Matched existing gym', value: existing?.id ? 'Yes (claim pending)' : 'No' },
    ],
  })

  return { ok: true }
}
