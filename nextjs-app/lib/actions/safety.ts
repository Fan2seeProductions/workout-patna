// Server actions for safety: block, unblock, report a user.
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'

export async function blockUser(input: { blockedId: string; reason?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Sign in required.' }
  if (user.id === input.blockedId) return { ok: false, error: "Can't block yourself." }

  const { error } = await supabase
    .from('user_blocks')
    .insert({ blocker_id: user.id, blocked_id: input.blockedId, reason: input.reason })

  if (error && !error.message.toLowerCase().includes('duplicate')) {
    return { ok: false, error: error.message }
  }

  // Also tear down any existing match between the two
  await supabase
    .from('matches')
    .update({ status: 'blocked' })
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${input.blockedId}),and(sender_id.eq.${input.blockedId},receiver_id.eq.${user.id})`,
    )

  revalidatePath('/app/discover')
  revalidatePath('/app/browse')
  revalidatePath('/app/matches')
  revalidatePath('/app/messages')
  return { ok: true }
}

export async function unblockUser(blockedId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Sign in required.' }

  const { error } = await supabase
    .from('user_blocks')
    .delete()
    .eq('blocker_id', user.id)
    .eq('blocked_id', blockedId)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/app/profile')
  return { ok: true }
}

export async function reportUser(input: {
  reportedId: string
  reason: string
  details?: string
  matchId?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Sign in required.' }
  if (!input.reason?.trim()) return { ok: false, error: 'Pick a reason.' }

  const { error } = await supabase
    .from('user_reports')
    .insert({
      reporter_id: user.id,
      reported_id: input.reportedId,
      reason: input.reason.trim(),
      details: input.details?.trim() || null,
      match_id: input.matchId ?? null,
    })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
