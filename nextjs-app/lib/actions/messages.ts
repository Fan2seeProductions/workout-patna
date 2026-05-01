// Server actions for sending messages.
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'

export async function sendMessage(matchId: string, body: string) {
  const trimmed = body.trim()
  if (!trimmed) return { ok: false, error: 'Empty message.' }
  if (trimmed.length > 2000) return { ok: false, error: 'Too long.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  const { data, error } = await supabase
    .from('messages')
    .insert({ match_id: matchId, sender_id: user.id, body: trimmed })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/app/messages/${matchId}`)
  return { ok: true, id: data.id }
}

export async function markMessagesRead(matchId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false }

  await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('match_id', matchId)
    .neq('sender_id', user.id)
    .is('read_at', null)

  return { ok: true }
}
