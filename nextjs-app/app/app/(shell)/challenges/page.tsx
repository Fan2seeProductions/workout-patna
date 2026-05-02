// /app/challenges — daily / weekly / monthly tabs, active challenges,
// join + check-in flow. Mirrors the Replit Challenges page.
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { ChallengesClient, type ChallengeRow, type UserChallengeRow } from './ChallengesClient'

export const metadata = { title: 'Challenges', robots: { index: false, follow: false } }

export default async function ChallengesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/auth')

  const today = new Date().toISOString().slice(0, 10)

  const [{ data: challenges }, { data: joined }, { data: checkins }] = await Promise.all([
    supabase
      .from('challenges')
      .select('id, title, description, type, target_count, badge, reward, entry_fee, starts_at, ends_at')
      .eq('active', true)
      .order('created_at', { ascending: true }),
    supabase
      .from('challenge_participants')
      .select('challenge_id, joined_at')
      .eq('user_id', user.id),
    supabase
      .from('challenge_checkins')
      .select('challenge_id, day')
      .eq('user_id', user.id),
  ])

  const checkinCounts = new Map<string, { progress: number; checkedToday: boolean }>()
  for (const ch of (challenges ?? [])) {
    const rows = (checkins ?? []).filter(c => c.challenge_id === ch.id)
    checkinCounts.set(ch.id, {
      progress: rows.length,
      checkedToday: rows.some(r => r.day === today),
    })
  }

  const userChallenges: UserChallengeRow[] = (joined ?? []).map(j => {
    const counts = checkinCounts.get(j.challenge_id) ?? { progress: 0, checkedToday: false }
    return {
      challenge_id: j.challenge_id,
      progress: counts.progress,
      checked_today: counts.checkedToday,
    }
  })

  return (
    <ChallengesClient
      challenges={(challenges ?? []) as ChallengeRow[]}
      userChallenges={userChallenges}
    />
  )
}
