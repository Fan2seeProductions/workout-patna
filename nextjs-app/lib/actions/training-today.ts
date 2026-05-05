// Server actions for Training Today posts.
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'

export type TrainingLookingFor =
  | 'spotter' | 'accountability' | 'cardio'
  | 'beginner_friendly' | 'group' | 'trainer'

export type CreateTrainingPostInput = {
  gym_id: string
  starts_at: string         // ISO timestamp
  workout_type?: string
  notes?: string
  looking_for?: TrainingLookingFor[]
}

export async function createTrainingPost(input: CreateTrainingPostInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  if (!input.gym_id) return { ok: false, error: 'Pick a location.' }
  if (!input.starts_at) return { ok: false, error: 'Pick a time.' }

  const startsAt = new Date(input.starts_at)
  if (Number.isNaN(startsAt.getTime())) {
    return { ok: false, error: 'Invalid time.' }
  }

  const { data, error } = await supabase
    .from('training_today')
    .insert({
      user_id: user.id,
      gym_id: input.gym_id,
      starts_at: startsAt.toISOString(),
      workout_type: input.workout_type?.trim() || null,
      notes: input.notes?.trim() || null,
      looking_for: input.looking_for ?? [],
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }

  revalidatePath('/app/discover')
  revalidatePath('/app/home')
  return { ok: true, id: data.id }
}

export async function cancelTrainingPost(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false }
  await supabase
    .from('training_today')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .eq('user_id', user.id)
  revalidatePath('/app/discover')
  return { ok: true }
}
