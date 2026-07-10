// Server action: post a formatted workout from the AI Coach bot
// into the member's in-app chat thread.
//
// Uses the `bot_send_workout` SECURITY DEFINER RPC via the service-role
// client. That RPC is REVOKE'd from anon + authenticated (it can post a
// message AS the bot to ANY user's thread, so it must not be reachable from a
// browser session), so only the service-role client can call it.
//
// NOTE: pure helpers (BOT_ID, formatWorkoutMessage) live in
// ../coach-chat-helpers because 'use server' files may only export
// async functions.
'use server'

import { createAdminClient } from '../supabase/admin'
import type { WorkoutPlan } from '../ai/workout'
import { formatWorkoutMessage } from '../coach-chat-helpers'

/**
 * Post a formatted workout from the AI Coach bot to the member's chat thread.
 * Creates the match thread if it doesn't exist yet.
 * Fire-and-forget safe — errors are logged but never thrown.
 */
export async function sendWorkoutToChat(opts: {
  userId: string
  plan: WorkoutPlan
  firstName: string | null
}): Promise<{ ok: boolean; messageId?: string }> {
  const { userId, plan, firstName } = opts

  try {
    const body = formatWorkoutMessage(plan, firstName)
    const supabase = createAdminClient()
    if (!supabase) {
      console.error('[coach-chat] SUPABASE_SERVICE_ROLE_KEY not set — cannot post bot message.')
      return { ok: false }
    }

    const { data, error } = await supabase
      .rpc('bot_send_workout', { p_user_id: userId, p_body: body })

    if (error) {
      console.error('[coach-chat] bot_send_workout RPC error:', error.message)
      return { ok: false }
    }

    return { ok: true, messageId: data as string }
  } catch (err) {
    console.error('[coach-chat] unexpected error:', err)
    return { ok: false }
  }
}
