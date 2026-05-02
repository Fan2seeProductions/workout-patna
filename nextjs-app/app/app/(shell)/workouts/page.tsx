// /app/workouts — free workouts library. Filter by body part + level,
// expand a card to see equipment + instructions.
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { WorkoutsClient, type WorkoutRow } from './WorkoutsClient'

export const metadata = { title: 'Free Workouts', robots: { index: false, follow: false } }

export default async function WorkoutsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/auth')

  const { data: workouts } = await supabase
    .from('workouts')
    .select('id, title, description, level, body_part, equipment, duration, instructions, is_free')
    .order('body_part', { ascending: true })
    .limit(200)

  return <WorkoutsClient workouts={(workouts ?? []) as WorkoutRow[]} />
}
