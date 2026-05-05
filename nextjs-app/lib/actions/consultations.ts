// Server actions for trainer consultations.
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'

// Legacy quick-claim flow used by the old Browse page.
// One free consultation per user per gym (enforced by query check below).
export async function claimConsultation(input: { trainerId: string; gymId: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Sign in required.' }

  const { data: existing } = await supabase
    .from('trainer_consultations')
    .select('id')
    .eq('user_id', user.id)
    .eq('gym_id', input.gymId)
    .maybeSingle()

  if (existing) {
    return { ok: false, error: 'You already claimed your free consultation at this gym.' }
  }

  const { error } = await supabase
    .from('trainer_consultations')
    .insert({
      user_id: user.id,
      trainer_id: input.trainerId,
      gym_id: input.gymId,
      status: 'claimed',
    })

  if (error) return { ok: false, error: error.message }

  revalidatePath('/app/browse')
  revalidatePath('/app/discover')
  return { ok: true }
}

// Full request flow used by /app/trainers/[id]
export type ConsultationInput = {
  trainer_id: string
  preferred_at?: string | null
  message?: string
  user_name?: string
}

export async function requestConsultation(input: ConsultationInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Sign in required.' }

  if (!input.trainer_id) return { ok: false, error: 'Missing trainer.' }

  const { data: trainer } = await supabase
    .from('trainers')
    .select('id, gym_id')
    .eq('id', input.trainer_id)
    .maybeSingle()
  if (!trainer) return { ok: false, error: 'Trainer not found.' }

  const { error } = await supabase.from('trainer_consultations').insert({
    user_id: user.id,
    trainer_id: trainer.id,
    gym_id: trainer.gym_id,
    status: 'pending',
    preferred_at: input.preferred_at ?? null,
    message: input.message?.trim() || null,
    user_name: input.user_name?.trim() || null,
    user_email: user.email ?? null,
  })

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/app/trainers/${trainer.id}`)
  return { ok: true }
}
