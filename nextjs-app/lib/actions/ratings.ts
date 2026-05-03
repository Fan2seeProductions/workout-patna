// Server actions for rating other Partnas (1-5 stars + optional comment).
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'

export async function rateUser(input: {
  ratedUserId: string
  score: number
  comment?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Sign in required.' }
  if (user.id === input.ratedUserId) return { ok: false, error: "Can't rate yourself." }
  if (input.score < 1 || input.score > 5) return { ok: false, error: 'Score must be 1 to 5.' }

  // Upsert so users can update their rating
  const { error } = await supabase
    .from('ratings')
    .upsert(
      {
        rated_user_id: input.ratedUserId,
        rated_by_user_id: user.id,
        score: input.score,
        comment: input.comment?.trim() || null,
      },
      { onConflict: 'rated_user_id,rated_by_user_id' },
    )

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/app/profile/${input.ratedUserId}`)
  return { ok: true }
}

export async function getUserRatingSummary(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ratings')
    .select('score')
    .eq('rated_user_id', userId)

  if (error || !data || data.length === 0) return { average: 0, count: 0 }

  const total = data.reduce((sum, r) => sum + r.score, 0)
  return { average: total / data.length, count: data.length }
}
