// Server actions for trainer self-signup.
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'
import { notifyIntake } from '../email/intake-notify'

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

  await notifyIntake({
    kind: 'Trainer application',
    category: 'trainers',
    who: name,
    replyTo: user.email ?? undefined,
    adminUrl: 'https://workoutpartna.com/app/admin/trainers',
    fields: [
      { label: 'Name', value: name },
      { label: 'Email', value: user.email ?? null },
      { label: 'Specialties', value: input.specialties ?? null },
      { label: 'Certifications', value: input.certifications ?? null },
      { label: 'Years experience', value: input.years_experience ?? null },
      { label: 'Booking link', value: input.booking_link ?? null },
      { label: 'Bio', value: input.bio ?? null },
    ],
  })

  revalidatePath('/app/trainers/apply')
  return { ok: true }
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
