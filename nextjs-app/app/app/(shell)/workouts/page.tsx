// /app/workouts — free exercise library. Served from the bundled
// free-exercise-db dataset (not the DB). Auth-gated; the server trims each
// entry to a lightweight card shape (no instructions — those would bloat the
// client payload) and hands the list to the client for search + filtering.
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { allExercises, exerciseSlug, exerciseImageUrl } from '../../../../lib/exercises/match'
import { WorkoutsClient, type ExerciseCard } from './WorkoutsClient'

export const metadata = { title: 'Exercise Library', robots: { index: false, follow: false } }

export default async function WorkoutsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/auth')

  const exercises: ExerciseCard[] = allExercises().map(ex => ({
    id: ex.id,
    name: ex.name,
    slug: exerciseSlug(ex),
    level: ex.level,
    equipment: ex.equipment,
    muscle: ex.primaryMuscles[0] ?? null,
    thumbUrl: ex.images[0] ? exerciseImageUrl(ex.images[0]) : null,
  }))

  return <WorkoutsClient exercises={exercises} />
}
