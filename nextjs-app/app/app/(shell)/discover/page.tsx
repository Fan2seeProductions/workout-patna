// /app/discover (aliased as /app/browse). Mirrors the Replit Browse page:
// mode toggle (partners / trainers), search, level filters, profile cards
// with compatibility, lock overlay for non-premium users beyond row 2,
// trainer cards with claim-consultation button.
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { matchScore } from '../../../../lib/matching'
import { BrowseClient } from './BrowseClient'

export const metadata = { title: 'Find a Partna', robots: { index: false, follow: false } }

export default async function DiscoverPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const [{ data: me }, { data: others }, { data: trainers }, { data: claimedRows }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('profiles').select('*').neq('id', user.id).limit(50),
    supabase.from('trainers').select('id, gym_id, name, bio, specialties, photo_url, booking_link, is_active').eq('is_active', true),
    supabase.from('trainer_consultations').select('gym_id').eq('user_id', user.id),
  ])

  const meProfile = me ?? null
  const profileList = (others ?? []).map(p => ({
    ...p,
    score: meProfile ? matchScore(meProfile, p) : 80,
  })).sort((a, b) => b.score - a.score)

  const claimedGymIds = (claimedRows ?? []).map(r => r.gym_id)

  return (
    <BrowseClient
      profiles={profileList}
      trainers={trainers ?? []}
      claimedGymIds={claimedGymIds}
      isPremium={!!meProfile?.is_premium}
    />
  )
}
