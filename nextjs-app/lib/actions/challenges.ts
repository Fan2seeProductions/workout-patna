// Server actions for joining challenges and checking in.
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'

export async function joinChallenge(challengeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  const { error } = await supabase
    .from('challenge_participants')
    .insert({ challenge_id: challengeId, user_id: user.id })

  if (error && !error.message.includes('duplicate')) {
    return { ok: false, error: error.message }
  }

  revalidatePath('/app/challenges')
  revalidatePath(`/app/challenges/${challengeId}`)
  return { ok: true }
}

export async function leaveChallenge(challengeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  const { error } = await supabase
    .from('challenge_participants')
    .delete()
    .eq('challenge_id', challengeId)
    .eq('user_id', user.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/app/challenges')
  revalidatePath(`/app/challenges/${challengeId}`)
  return { ok: true }
}

export async function checkInChallenge(challengeId: string, note?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  const { error } = await supabase
    .from('challenge_checkins')
    .insert({ challenge_id: challengeId, user_id: user.id, note })

  if (error && !error.message.includes('duplicate')) {
    return { ok: false, error: error.message }
  }

  revalidatePath(`/app/challenges/${challengeId}`)
  return { ok: true }
}
