// Pure helpers for coach-chat. Lives outside lib/actions/ so it can export
// sync values and functions — server-action files (with 'use server') may
// only export async functions.

import type { WorkoutPlan } from './ai/workout'

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
