// Server action: post a formatted workout from the AI Coach bot
// into the member's in-app chat thread.
//
// Uses the `bot_send_workout` SECURITY DEFINER RPC so we never need
// the service-role key — the RPC bypasses RLS internally.
'use server'

import { createClient } from '../supabase/server'
import type { WorkoutPlan } from '../ai/workout'

export const BOT_ID = '00000000-0000-0000-0000-000000000001'

/** Format a WorkoutPlan into a clean, readable chat message with emoji headers. */
export function formatWorkoutMessage(plan: WorkoutPlan, firstName: string | null): string {
  const greeting = firstName ? `${firstName}, here's your workout for today! 💪` : `Here's your workout for today! 💪`

  const parts: string[] = [
    `🏋️ ${greeting}`,
    '',
    `📌 FOCUS`,
    plan.focus,
    '',
    `🔥 WARM UP`,
    plan.warm_up,
    '',
    `💪 MAIN WORKOUT`,
    plan.main,
  ]

  if (plan.finisher?.trim()) {
    parts.push('', `⚡ FINISHER`, plan.finisher)
  }

  if (plan.notes?.trim()) {
    parts.push('', `📝 COACH NOTES`, plan.notes)
  }

  parts.push(
    '',
    `─────────────────────`,
    `Reply and let me know how it went! I'll adjust tomorrow's plan based on your feedback.`,
  )

  return parts.join('\n')
}

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
    const supabase = await createClient()

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
