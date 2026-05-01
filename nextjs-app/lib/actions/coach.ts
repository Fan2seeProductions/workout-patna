// Server actions for AI Daily Coach.
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'
import { generateWorkout, type Intake } from '../ai/workout'

export async function saveIntake(patch: Intake & { delivery_time?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  const { error } = await supabase
    .from('ai_coach_intake')
    .upsert({ user_id: user.id, ...patch }, { onConflict: 'user_id' })

  if (error) return { ok: false, error: error.message }

  revalidatePath('/app/coach')
  return { ok: true }
}

export async function generateTodayWorkout() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  const today = new Date().toISOString().slice(0, 10)

  // Already generated for today?
  const { data: existing } = await supabase
    .from('ai_workouts')
    .select('id')
    .eq('user_id', user.id)
    .eq('day', today)
    .maybeSingle()

  if (existing) {
    revalidatePath('/app/coach')
    return { ok: true, id: existing.id }
  }

  // Pull intake
  const { data: intake } = await supabase
    .from('ai_coach_intake')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const plan = await generateWorkout(intake as Intake | null)

  const { data: created, error } = await supabase
    .from('ai_workouts')
    .insert({ user_id: user.id, day: today, ...plan })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }

  revalidatePath('/app/coach')
  return { ok: true, id: created.id }
}

export async function markWorkoutFeedback(
  workoutId: string,
  feedback: 'too_easy' | 'too_hard' | 'sore' | 'skipped' | 'completed',
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false }

  const patch: { feedback: string; completed_at?: string } = { feedback }
  if (feedback === 'completed') patch.completed_at = new Date().toISOString()

  await supabase.from('ai_workouts').update(patch).eq('id', workoutId).eq('user_id', user.id)

  revalidatePath('/app/coach')
  return { ok: true }
}
