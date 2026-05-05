// Compatibility scoring (Workstream B).
//
// Spec: same gym 40, schedule overlap 25, shared goal 15, fitness level 10,
//       shared workout style 10. Total 100.
//
// Returns null when there is not enough data to score honestly. The UI
// renders that as "Complete your profile to see match score" instead of
// a misleading 0%.

export type ScoringProfile = {
  id: string
  gym_id?: string | null
  primary_location?: string | null
  goals?: string[] | null
  styles?: string[] | null
  schedule_days?: string[] | null
  schedule_times?: string[] | null
  fitness_level?: string | null
  vibe?: string | null
  onboarded?: boolean | null
}

export type CompatBreakdown = {
  total: number              // 0..100, integer
  badges: string[]           // human-readable explainers
  parts: {
    sameGym: number          // 0 or 40
    schedule: number         // 0..25
    goal: number             // 0 or 15
    level: number            // 0 or 10
    style: number            // 0 or 10
  }
}

const LEVEL_RANK: Record<string, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
  Athlete: 3,
}

function intersect(a?: string[] | null, b?: string[] | null): string[] {
  if (!a?.length || !b?.length) return []
  const setB = new Set(b)
  const out: string[] = []
  for (const v of a) if (setB.has(v)) out.push(v)
  return out
}

function hasMinimumSignal(p: ScoringProfile): boolean {
  // We need at least 2 of these to score honestly: gym, goals, styles, schedule
  let n = 0
  if (p.gym_id || p.primary_location) n++
  if ((p.goals ?? []).length > 0) n++
  if ((p.styles ?? []).length > 0) n++
  if ((p.schedule_days ?? []).length > 0 || (p.schedule_times ?? []).length > 0) n++
  return n >= 2
}

/**
 * Returns the full compat breakdown, or null when one of the profiles
 * is too incomplete to score (callers should show "Complete your profile").
 */
export function compatBreakdown(
  me: ScoringProfile,
  them: ScoringProfile,
): CompatBreakdown | null {
  if (!hasMinimumSignal(me) || !hasMinimumSignal(them)) return null

  const parts = { sameGym: 0, schedule: 0, goal: 0, level: 0, style: 0 }
  const badges: string[] = []

  // Same gym (uuid match preferred, fall back to legacy text equality)
  const sameGym =
    !!(me.gym_id && them.gym_id && me.gym_id === them.gym_id) ||
    !!(
      !me.gym_id && !them.gym_id &&
      me.primary_location && them.primary_location &&
      me.primary_location.trim().toLowerCase() === them.primary_location.trim().toLowerCase()
    )
  if (sameGym) {
    parts.sameGym = 40
    badges.push('Same gym')
  }

  // Schedule overlap (days + times). 25 split: 15 days, 10 times.
  const sharedDays  = intersect(me.schedule_days,  them.schedule_days)
  const sharedTimes = intersect(me.schedule_times, them.schedule_times)
  const dayMax  = Math.max((me.schedule_days  ?? []).length, (them.schedule_days  ?? []).length, 1)
  const timeMax = Math.max((me.schedule_times ?? []).length, (them.schedule_times ?? []).length, 1)
  const dayPts  = Math.round((sharedDays.length  / dayMax)  * 15)
  const timePts = Math.round((sharedTimes.length / timeMax) * 10)
  parts.schedule = dayPts + timePts
  if (parts.schedule > 0) {
    if (sharedTimes.length === 1)       badges.push(`${sharedTimes[0]} match`)
    else if (sharedTimes.length > 1)    badges.push('Schedule match')
    else if (sharedDays.length > 0)     badges.push(`${sharedDays.length} day${sharedDays.length > 1 ? 's' : ''} overlap`)
  }

  // Shared goal (any single shared goal = 15)
  const sharedGoals = intersect(me.goals, them.goals)
  if (sharedGoals.length > 0) {
    parts.goal = 15
    badges.push(`Both ${sharedGoals[0].toLowerCase()}`)
  }

  // Fitness level: same = 10, off-by-one = 5, else 0
  if (me.fitness_level && them.fitness_level) {
    const a = LEVEL_RANK[me.fitness_level]
    const b = LEVEL_RANK[them.fitness_level]
    if (a !== undefined && b !== undefined) {
      const diff = Math.abs(a - b)
      if (diff === 0) {
        parts.level = 10
        badges.push('Similar fitness level')
      } else if (diff === 1) {
        parts.level = 5
      }
    }
  }

  // Shared workout style (any single shared style = 10)
  const sharedStyles = intersect(me.styles, them.styles)
  if (sharedStyles.length > 0) {
    parts.style = 10
    badges.push(`Shared ${sharedStyles[0].toLowerCase()}`)
  }

  const total = parts.sameGym + parts.schedule + parts.goal + parts.level + parts.style

  return { total, badges, parts }
}

/**
 * Backwards-compatible numeric score. Returns null when scoring is impossible
 * so callers can render a "complete your profile" prompt instead of a 0%.
 */
export function matchScore(me: ScoringProfile, them: ScoringProfile): number | null {
  const b = compatBreakdown(me, them)
  return b ? b.total : null
}
