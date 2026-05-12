// Server actions for the user's own profile.
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../supabase/server'
import { notifyIntake } from '../email/intake-notify'
import { sanitizePrompts, type SavedPrompt } from '../profile/prompts'

export type ProfileUpdate = {
  display_name?: string
  age?: number | null
  bio?: string
  fitness_level?: string
  goals?: string[]
  styles?: string[]
  schedule_days?: string[]
  schedule_times?: string[]
  vibe?: string
  primary_location?: string
  gym_id?: string | null
  onboarded?: boolean
}

export async function updateMyProfile(patch: ProfileUpdate) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  // If this update marks onboarding complete, check whether the user was
  // *previously* not onboarded — that flips this from a profile edit into
  // a "new user finished onboarding" intake event we want to notify on.
  let firstOnboardingCompletion = false
  if (patch.onboarded === true) {
    const { data: prev } = await supabase
      .from('profiles')
      .select('onboarded')
      .eq('id', user.id)
      .maybeSingle()
    firstOnboardingCompletion = !prev?.onboarded
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, ...patch }, { onConflict: 'id' })

  if (error) return { ok: false, error: error.message }

  // Best-effort operator notification on first onboarding completion.
  if (firstOnboardingCompletion) {
    await notifyIntake({
      kind: 'Onboarding completed',
      category: 'onboarding',
      who: patch.display_name || user.email || '(unknown user)',
      replyTo: user.email ?? undefined,
      adminUrl: 'https://workoutpartna.com/app/admin/users',
      fields: [
        { label: 'Email', value: user.email ?? null },
        { label: 'Display name', value: patch.display_name ?? null },
        { label: 'Primary location', value: patch.primary_location ?? null },
        { label: 'Fitness level', value: patch.fitness_level ?? null },
        { label: 'Goals', value: patch.goals ?? null },
        { label: 'Vibe', value: patch.vibe ?? null },
        { label: 'Schedule days', value: patch.schedule_days ?? null },
        { label: 'Schedule times', value: patch.schedule_times ?? null },
      ],
    })
  }

  revalidatePath('/app/profile')
  revalidatePath('/app/discover')
  return { ok: true }
}

export async function updateMyPrompts(prompts: SavedPrompt[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: 'Not signed in.' }

  const clean = sanitizePrompts(prompts)
  const { error } = await supabase
    .from('profiles')
    .update({ profile_prompts: clean })
    .eq('id', user.id)
  if (error) return { ok: false as const, error: error.message }

  revalidatePath('/app/profile')
  revalidatePath('/app/discover')
  revalidatePath('/app/browse')
  return { ok: true as const, count: clean.length }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/app')
}
