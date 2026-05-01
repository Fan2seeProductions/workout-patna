// Server actions for the user's own profile.
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../supabase/server'

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
  onboarded?: boolean
}

export async function updateMyProfile(patch: ProfileUpdate) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  const { error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', user.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/app/profile')
  revalidatePath('/app/discover')
  return { ok: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/app')
}
