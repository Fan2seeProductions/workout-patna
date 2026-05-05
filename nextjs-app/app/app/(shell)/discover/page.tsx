// /app/discover (aliased as /app/browse). Workstream B/C upgrade:
// - de-duplicates profiles
// - skips profiles that don't have minimum signal (no Unknown Location, no 0%)
// - resolves gym_id → gym name + city so cards never read "Unknown Location"
// - powers the new 5-tab BrowseShell (At My Location / Nearby / Training Today / Groups / Trainers)
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { compatBreakdown, type ScoringProfile } from '../../../../lib/matching'
import { BrowseShell, type BrowseProfile, type GymLite, type TrainerLite, type TrainingTodayPost } from './BrowseShell'

export const metadata = { title: 'Find a Partna', robots: { index: false, follow: false } }

export default async function DiscoverPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const { data: meRaw } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  const me = (meRaw ?? null) as ScoringProfile & { is_premium?: boolean } | null
  const isPremium = !!me?.is_premium
  const myGymId = me?.gym_id ?? null

  // Pull other profiles. Free users only see Partnas at their gym.
  // Anyone without a gym yet sees everyone (so first-run isn't empty).
  let q = supabase
    .from('profiles')
    .select('id, display_name, age, bio, fitness_level, goals, styles, schedule_days, schedule_times, vibe, primary_location, gym_id, photo_url, is_premium, onboarded')
    .neq('id', user.id)
    .limit(100)

  if (myGymId && !isPremium) q = q.eq('gym_id', myGymId)

  const [{ data: othersRaw }, { data: gyms }, { data: trainers }, { data: trainingToday }] = await Promise.all([
    q,
    supabase.from('gyms').select('id, name, type, city, state'),
    supabase.from('trainers').select('id, gym_id, name, bio, specialties, photo_url, booking_link, is_active').eq('is_active', true),
    supabase
      .from('training_today')
      .select(`
        id, user_id, gym_id, starts_at, workout_type, notes, looking_for, status,
        user:profiles!training_today_user_id_fkey(id, display_name, photo_url),
        gym:gyms!training_today_gym_id_fkey(id, name, city)
      `)
      .gte('starts_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .order('starts_at', { ascending: true })
      .limit(40),
  ])

  // Dedupe by id (defensive against join multiplication).
  const seen = new Set<string>()
  const dedupedOthers = (othersRaw ?? []).filter(p => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })

  // Build a fast gym lookup
  const gymById = new Map<string, GymLite>()
  for (const g of gyms ?? []) gymById.set(g.id, g as GymLite)

  // Score every other profile. Skip cards with null score (insufficient data).
  const scored: BrowseProfile[] = []
  for (const p of dedupedOthers) {
    const gym = p.gym_id ? gymById.get(p.gym_id) ?? null : null
    const breakdown = me ? compatBreakdown(me, p as ScoringProfile) : null
    scored.push({
      id: p.id,
      display_name: p.display_name,
      age: p.age,
      bio: p.bio,
      fitness_level: p.fitness_level,
      goals: p.goals,
      styles: p.styles,
      schedule_days: p.schedule_days,
      schedule_times: p.schedule_times,
      vibe: p.vibe,
      primary_location: p.primary_location,
      gym_id: p.gym_id,
      photo_url: p.photo_url,
      is_premium: p.is_premium,
      gym,
      score: breakdown?.total ?? null,
      badges: breakdown?.badges ?? [],
    })
  }

  scored.sort((a, b) => (b.score ?? -1) - (a.score ?? -1))

  const myGym = myGymId ? gymById.get(myGymId) ?? null : null

  return (
    <BrowseShell
      me={{
        id: user.id,
        gym_id: myGymId,
        isPremium,
        onboarded: !!me?.onboarded,
        gym: myGym,
      }}
      profiles={scored}
      trainers={(trainers ?? []) as TrainerLite[]}
      trainingToday={(trainingToday ?? []) as unknown as TrainingTodayPost[]}
    />
  )
}
