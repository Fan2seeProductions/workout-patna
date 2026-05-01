// Simple match scoring. Compares two profile records and returns 0..100.
// Heavier weight on shared goals + same gym + overlapping schedule.

type Profile = {
  id: string
  primary_location?: string | null
  goals?: string[] | null
  styles?: string[] | null
  schedule_days?: string[] | null
  schedule_times?: string[] | null
  fitness_level?: string | null
  vibe?: string | null
}

function setOverlap(a?: string[] | null, b?: string[] | null) {
  if (!a?.length || !b?.length) return 0
  const setB = new Set(b)
  let count = 0
  for (const v of a) if (setB.has(v)) count++
  return count / Math.max(a.length, b.length)
}

export function matchScore(me: Profile, them: Profile): number {
  let score = 0
  let weight = 0

  // Same primary location: 30 points
  if (me.primary_location && them.primary_location) {
    weight += 30
    if (me.primary_location === them.primary_location) score += 30
  }

  // Goal overlap: 25 points
  weight += 25
  score += setOverlap(me.goals, them.goals) * 25

  // Style overlap: 20 points
  weight += 20
  score += setOverlap(me.styles, them.styles) * 20

  // Schedule day overlap: 15 points
  weight += 15
  score += setOverlap(me.schedule_days, them.schedule_days) * 15

  // Schedule time overlap: 10 points
  weight += 10
  score += setOverlap(me.schedule_times, them.schedule_times) * 10

  // If we had no signal at all, return 50 as a neutral baseline
  if (weight === 0) return 50

  return Math.round((score / weight) * 100)
}
