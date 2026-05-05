// Server action for the partner lead form on /for-gyms-apartments.
'use server'

import { createClient } from '../supabase/server'

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

  // Best-effort email notification via Resend.
  // No-op when RESEND_API_KEY isn't set, so this never blocks the form.
  await sendLeadNotificationEmail({
    name, email, organization,
    location_type: input.location_type,
    member_count: input.member_count,
    city: input.city,
    state: input.state,
    phone: input.phone,
    message: input.message,
  })

  return { ok: true }
}

async function sendLeadNotificationEmail(lead: {
  name: string
  email: string
  phone?: string
  organization: string
  location_type: PartnerLeadInput['location_type']
  member_count?: string
  city?: string
  state?: string
  message?: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const to     = process.env.PARTNER_LEAD_EMAIL_TO ?? 'sales@fan2seeproductions.com'
  const from   = process.env.PARTNER_LEAD_EMAIL_FROM ?? 'WorkoutPartna <noreply@workoutpartna.com>'
  if (!apiKey) return // graceful no-op until the key is added in Vercel

  const subject = `New partner lead: ${lead.organization} (${lead.location_type})`
  const lines = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.phone ? `Phone: ${lead.phone}` : null,
    `Organization: ${lead.organization}`,
    `Type: ${lead.location_type}`,
    lead.member_count ? `Members/Residents: ${lead.member_count}` : null,
    [lead.city, lead.state].filter(Boolean).length ? `Location: ${[lead.city, lead.state].filter(Boolean).join(', ')}` : null,
    '',
    lead.message ? `Message:\n${lead.message}` : null,
  ].filter(Boolean).join('\n')

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: lead.email,
        subject,
        text: lines,
      }),
    })
  } catch {
    // Never fail the form on a transient email error.
  }
}
