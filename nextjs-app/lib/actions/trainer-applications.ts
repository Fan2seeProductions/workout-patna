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

  revalidatePath('/app/trainers/apply')
  return { ok: true }
}
