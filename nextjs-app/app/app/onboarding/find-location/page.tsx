// Onboarding step 3: real gym picker. Loads rows from public.gyms and
// writes profiles.gym_id when the user picks one.
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { FindLocationClient, type GymRow } from './FindLocationClient'

export const metadata = { title: 'Find your spot', robots: { index: false, follow: false } }

export default async function FindLocationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const [{ data: me }, { data: gyms }] = await Promise.all([
    supabase.from('profiles').select('gym_id, primary_location').eq('id', user.id).maybeSingle(),
    supabase
      .from('gyms')
      .select('id, name, type, city, state, members')
      .order('name')
      .limit(1000),
  ])

  return (
    <FindLocationClient
      gyms={(gyms ?? []) as GymRow[]}
      defaultGymId={me?.gym_id ?? null}
    />
  )
}
