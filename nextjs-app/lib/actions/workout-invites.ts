// Server actions for in-chat workout invites.
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'

export type WorkoutInviteInput = {
  match_id: string
  starts_at: string         // ISO
  gym_id?: string | null
  workout_type?: string
  notes?: string
}

export async function sendWorkoutInvite(input: WorkoutInviteInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }
  if (!input.match_id || !input.starts_at) {
    return { ok: false, error: 'Missing match or time.' }
  }

  const startsAt = new Date(input.starts_at)
  if (Number.isNaN(startsAt.getTime())) return { ok: false, error: 'Invalid time.' }

  const { data, error } = await supabase
    .from('workout_invites')
    .insert({
      match_id: input.match_id,
      sender_id: user.id,
      gym_id: input.gym_id ?? null,
      starts_at: startsAt.toISOString(),
      workout_type: input.workout_type?.trim() || null,
      notes: input.notes?.trim() || null,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }

  // Also send a system-style message in the chat so the invite is visible.
  await supabase.from('messages').insert({
    match_id: input.match_id,
    sender_id: user.id,
    body: `📅 Workout invite: ${input.workout_type ?? 'Training'} · ${startsAt.toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })}${input.notes ? ` · ${input.notes}` : ''}`,
  })

  revalidatePath(`/app/messages/${input.match_id}`)
  return { ok: true, id: data.id }
}

export async function respondToInvite(inviteId: string, action: 'accept' | 'decline' | 'cancel') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false }
  const status =
    action === 'accept' ? 'accepted' :
    action === 'decline' ? 'declined' : 'cancelled'
  await supabase.from('workout_invites').update({ status }).eq('id', inviteId)
  return { ok: true }
}
