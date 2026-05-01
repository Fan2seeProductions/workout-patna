// Server actions for sending, accepting, declining, and cancelling match requests.
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'

async function getUserOrThrow() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in.')
  return { supabase, user }
}

export async function sendMatchRequest(receiverId: string) {
  const { supabase, user } = await getUserOrThrow()
  if (user.id === receiverId) throw new Error("Can't match yourself.")

  // Already a match between these two? (either direction)
  const { data: existing } = await supabase
    .from('matches')
    .select('id, sender_id, receiver_id, status')
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`,
    )
    .maybeSingle()

  if (existing) {
    // If the other user already sent us a pending request, accept it instead
    if (existing.status === 'pending' && existing.receiver_id === user.id) {
      const { error } = await supabase
        .from('matches')
        .update({ status: 'active' })
        .eq('id', existing.id)
      if (error) throw error
      revalidatePath('/app/matches')
      return { matched: true, matchId: existing.id }
    }
    return { matched: existing.status === 'active', matchId: existing.id }
  }

  const { data, error } = await supabase
    .from('matches')
    .insert({ sender_id: user.id, receiver_id: receiverId, status: 'pending' })
    .select('id')
    .single()
  if (error) throw error

  revalidatePath('/app/matches')
  return { matched: false, matchId: data.id }
}

export async function acceptMatchRequest(matchId: string) {
  const { supabase, user } = await getUserOrThrow()
  const { error } = await supabase
    .from('matches')
    .update({ status: 'active' })
    .eq('id', matchId)
    .eq('receiver_id', user.id)
    .eq('status', 'pending')
  if (error) throw error
  revalidatePath('/app/matches')
  return { ok: true }
}

export async function declineMatchRequest(matchId: string) {
  const { supabase, user } = await getUserOrThrow()
  const { error } = await supabase
    .from('matches')
    .update({ status: 'declined' })
    .eq('id', matchId)
    .eq('receiver_id', user.id)
    .eq('status', 'pending')
  if (error) throw error
  revalidatePath('/app/matches')
  return { ok: true }
}

export async function cancelMatchRequest(matchId: string) {
  const { supabase, user } = await getUserOrThrow()
  const { error } = await supabase
    .from('matches')
    .update({ status: 'cancelled' })
    .eq('id', matchId)
    .eq('sender_id', user.id)
    .eq('status', 'pending')
  if (error) throw error
  revalidatePath('/app/matches')
  return { ok: true }
}
