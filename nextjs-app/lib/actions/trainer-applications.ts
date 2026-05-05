// Server actions for trainer self-signup.
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'

export type TrainerApplicationInput = {
  name: string
  bio?: string
  specialties?: string[]
  certifications?: string
  years_experience?: number | null
  gym_id?: string | null
  booking_link?: string
  photo_url?: string
}

export async function submitTrainerApplication(input: TrainerApplicationInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Sign in required.' }

  const name = input.name?.trim()
  if (!name) return { ok: false, error: 'Name is required.' }

  const { error } = await supabase
    .from('trainer_applications')
    .upsert(
      {
        user_id: user.id,
        name,
        bio: input.bio?.trim() || null,
        specialties: input.specialties ?? [],
        certifications: input.certifications?.trim() || null,
        years_experience: input.years_experience ?? null,
        gym_id: input.gym_id ?? null,
        booking_link: input.booking_link?.trim() || null,
        photo_url: input.photo_url?.trim() || null,
        status: 'pending',
      },
      { onConflict: 'user_id' },
    )

  if (error) return { ok: false, error: error.message }

  await sendTrainerApplicationEmail({
    name,
    specialties: input.specialties ?? [],
    certifications: input.certifications,
    years_experience: input.years_experience,
  })

  revalidatePath('/app/trainers/apply')
  return { ok: true }
}

async function sendTrainerApplicationEmail(app: {
  name: string
  specialties: string[]
  certifications?: string
  years_experience?: number | null
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const to = process.env.PARTNER_LEAD_EMAIL_TO ?? 'sales@fan2seeproductions.com'
  const from = process.env.PARTNER_LEAD_EMAIL_FROM ?? 'WorkoutPartna <noreply@workoutpartna.com>'

  const lines = [
    `Name: ${app.name}`,
    app.specialties.length ? `Specialties: ${app.specialties.join(', ')}` : null,
    app.certifications ? `Certifications: ${app.certifications}` : null,
    app.years_experience != null ? `Experience: ${app.years_experience}+ years` : null,
    '',
    'Review at: https://workoutpartna.com/app/admin/trainers',
  ].filter(Boolean).join('\n')

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `New trainer application: ${app.name}`,
        text: lines,
      }),
    })
  } catch {
    // Never fail the form on a transient email error.
  }
}

export async function reviewTrainerApplication(
  applicationId: string,
  decision: 'approved' | 'rejected',
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'super_admin') {
    return { ok: false, error: 'Not authorized.' }
  }

  const { data: app, error: fetchErr } = await supabase
    .from('trainer_applications')
    .select('*')
    .eq('id', applicationId)
    .maybeSingle()

  if (fetchErr || !app) return { ok: false, error: 'Application not found.' }

  const { error } = await supabase
    .from('trainer_applications')
    .update({ status: decision, reviewed_at: new Date().toISOString(), reviewed_by: user.id })
    .eq('id', applicationId)

  if (error) return { ok: false, error: error.message }

  if (decision === 'approved') {
    await supabase.from('trainers').upsert(
      {
        user_id: app.user_id,
        name: app.name,
        bio: app.bio,
        specialties: app.specialties,
        certifications: app.certifications,
        years_experience: app.years_experience,
        gym_id: app.gym_id,
        booking_link: app.booking_link,
        photo_url: app.photo_url,
        is_active: true,
      },
      { onConflict: 'user_id' },
    )
  }

  revalidatePath('/app/admin/trainers')
  return { ok: true }
}
