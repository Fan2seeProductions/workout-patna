// /app/discover (aliased as /app/browse). Free users see only their gym
// community. Premium ($9.99/mo) unlocks the full Houston-metro network.
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { matchScore } from '../../../../lib/matching'
import { BrowseClient } from './BrowseClient'

export const metadata = { title: 'Find a Partna', robots: { index: false, follow: false } }

export default async function DiscoverPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const { data: me } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  const isPremium = !!me?.is_premium
  const myGymId = me?.gym_id ?? null

  // Build the partner query.
  // Free users only see Partnas at their gym.
  // Premium users see everyone in the network.
  // Users without a gym set yet see everyone (so first-run isn't empty).
  let partnerQuery = supabase
    .from('profiles')
    .select('*')
    .neq('id', user.id)
    .limit(60)

  if (myGymId && !isPremium) {
    partnerQuery = partnerQuery.eq('gym_id', myGymId)
  }

  const [{ data: others }, { data: trainers }, { data: claimedRows }, { data: myGym }, { data: allGyms }] = await Promise.all([
    partnerQuery,
    supabase.from('trainers').select('id, gym_id, name, bio, specialties, photo_url, booking_link, is_active').eq('is_active', true),
    supabase.from('trainer_consultations').select('gym_id').eq('user_id', user.id),
    myGymId
      ? supabase.from('gyms').select('id, name, type, city, state').eq('id', myGymId).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from('gyms').select('id, type'),
  ])

  const gymTypes: Record<string, string> = {}
  for (const g of allGyms ?? []) gymTypes[g.id] = g.type

  const profileList = (others ?? [])
    .map(p => ({ ...p, score: me ? matchScore(me, p) : 80 }))
    .sort((a, b) => b.score - a.score)

  const claimedGymIds = (claimedRows ?? []).map(r => r.gym_id)

  return (
    <BrowseClient
      profiles={profileList}
      trainers={trainers ?? []}
      claimedGymIds={claimedGymIds}
      isPremium={isPremium}
      myGym={myGym ?? null}
      gymTypes={gymTypes}
    />
  )
}
