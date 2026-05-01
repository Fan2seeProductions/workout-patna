// Discover: real Supabase data with computed match scores.
// Falls back gracefully when there's nothing yet.
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { matchScore } from '../../../../lib/matching'
import { DiscoverClient } from './DiscoverClient'

export const metadata = { title: 'Discover', robots: { index: false, follow: false } }

type ProfileRow = {
  id: string
  display_name: string | null
  age: number | null
  bio: string | null
  goals: string[] | null
  styles: string[] | null
  schedule_days: string[] | null
  schedule_times: string[] | null
  primary_location: string | null
  photo_url: string | null
  vibe: string | null
  fitness_level: string | null
}

export default async function DiscoverPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  // Pull my profile + everyone else
  const [{ data: me }, { data: others }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('profiles').select('*').neq('id', user.id).limit(50),
  ])

  const myProfile = (me ?? null) as ProfileRow | null
  const profiles = (others ?? []) as ProfileRow[]

  // Compute match score and sort
  const scored = profiles
    .map(p => ({ ...p, score: myProfile ? matchScore(myProfile, p) : 70 }))
    .sort((a, b) => b.score - a.score)

  return <DiscoverClient profiles={scored} />
}
