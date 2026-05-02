// Server actions for adding gyms during onboarding.
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'

export async function addGym(input: {
  name: string
  city: string
  state: string
  type: 'gym' | 'apartment' | 'community_center'
  address?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  const { data, error } = await supabase
    .from('gyms')
    .insert({
      name: input.name.trim(),
      city: input.city.trim(),
      state: input.state.trim() || 'TX',
      type: input.type,
      address: (input.address ?? '').trim() || `${input.city.trim()}, ${input.state.trim()}`,
      created_by_user_id: user.id,
      location_source: 'manual',
      location_status: 'unverified',
    })
    .select('id, name, type, city, state, address, members')
    .single()

  if (error) return { ok: false, error: error.message }

  revalidatePath('/app/onboarding')
  return { ok: true, gym: data }
}
