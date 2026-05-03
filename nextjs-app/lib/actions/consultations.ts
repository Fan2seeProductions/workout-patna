// Server actions for trainer consultations.
// One free consultation per user per gym (enforced by unique index).
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'

export async function claimConsultation(input: { trainerId: string; gymId: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Sign in required.' }

  // Already claimed at this gym?
  const { data: existing } = await supabase
    .from('trainer_consultations')
    .select('id, status, claimed_at')
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
