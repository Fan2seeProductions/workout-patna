// Profile completion meter. Powers the "Complete your profile" nudge
// and the percentage shown on the profile screen.

export type CompletionProfile = {
  display_name?: string | null
  age?: number | null
  bio?: string | null
  fitness_level?: string | null
  goals?: string[] | null
  styles?: string[] | null
  schedule_days?: string[] | null
  schedule_times?: string[] | null
  vibe?: string | null
  primary_location?: string | null
  gym_id?: string | null
  photo_url?: string | null
}

const fields: { key: keyof CompletionProfile; label: string; weight: number; check: (p: CompletionProfile) => boolean }[] = [
  { key: 'display_name', label: 'Display name', weight: 1,
    check: p => !!p.display_name?.trim() },
  { key: 'age', label: 'Age', weight: 1,
    check: p => typeof p.age === 'number' && p.age > 0 },
  { key: 'gym_id', label: 'Location', weight: 2,
    check: p => !!(p.gym_id || p.primary_location?.trim()) },
  { key: 'fitness_level', label: 'Fitness level', weight: 1,
    check: p => !!p.fitness_level },
  { key: 'goals', label: 'Goals', weight: 1,
    check: p => (p.goals ?? []).length > 0 },
  { key: 'styles', label: 'Workout style', weight: 1,
    check: p => (p.styles ?? []).length > 0 },
  { key: 'schedule_days', label: 'Schedule', weight: 1,
    check: p => (p.schedule_days ?? []).length > 0 || (p.schedule_times ?? []).length > 0 },
  { key: 'bio', label: 'Bio', weight: 1,
    check: p => !!p.bio?.trim() },
  { key: 'photo_url', label: 'Photo', weight: 1,
    check: p => !!p.photo_url },
]

export type Completion = {
  pct: number              // 0..100, integer
  missing: string[]        // friendly labels of missing fields
  ready: boolean           // pct >= 70 — enough to score and match
}

export function profileCompletion(p: CompletionProfile): Completion {
  const totalWeight = fields.reduce((s, f) => s + f.weight, 0)
  let achieved = 0
  const missing: string[] = []
  for (const f of fields) {
    if (f.check(p)) achieved += f.weight
    else missing.push(f.label)
  }
  const pct = Math.round((achieved / totalWeight) * 100)
  return { pct, missing, ready: pct >= 70 }
}
