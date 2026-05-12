// Curated Hinge-style profile prompts for WorkoutPartna.
// Members pick up to 3 and write a short answer. Prompts surface on profile +
// in the Discover swipe deck so first impressions are personality-first, not
// stat-first.
//
// Categories let us slot prompts intelligently into UI groupings, but storage
// is just { id, answer } pairs on profiles.profile_prompts.

export type ProfilePromptCategory =
  | 'identity'
  | 'training'
  | 'goals'
  | 'energy'
  | 'partner'
  | 'lifestyle'

export type ProfilePrompt = {
  id: string
  category: ProfilePromptCategory
  question: string
  placeholder: string
}

export const MAX_PROMPTS = 3
export const PROMPT_ANSWER_MAX = 180

export const PROFILE_PROMPTS: ProfilePrompt[] = [
  // Identity
  { id: 'why-i-train',         category: 'identity', question: 'Why I train',                       placeholder: 'For my kids. For my peace. For the version of me at 70…' },
  { id: 'origin-story',        category: 'identity', question: 'My fitness origin story',           placeholder: 'I started after…' },
  { id: 'unfiltered-me',       category: 'identity', question: 'The real me in one sentence',       placeholder: 'Loud playlists, quiet mornings, heavy sets.' },
  { id: 'what-Id-fix',         category: 'identity', question: "What I'd fix about gym culture",    placeholder: 'Less ego. More form checks.' },

  // Training style
  { id: 'training-style',      category: 'training', question: 'My training style',                 placeholder: 'Push-pull-legs, in and out in 60.' },
  { id: 'split-of-choice',     category: 'training', question: 'My split of choice',                placeholder: 'Upper / Lower / Conditioning.' },
  { id: 'go-to-lift',          category: 'training', question: 'My go-to lift',                     placeholder: 'Trap-bar deadlift. Always.' },
  { id: 'cardio-take',         category: 'training', question: 'My honest take on cardio',          placeholder: 'Zone 2 only. Or sprints. No middle.' },
  { id: 'rest-day-truth',      category: 'training', question: 'On rest days I…',                   placeholder: 'Walk, stretch, smoke a brisket.' },
  { id: 'gym-pet-peeve',       category: 'training', question: 'My gym pet peeve',                  placeholder: 'Curling in the squat rack.' },

  // Goals
  { id: 'this-year-goal',      category: 'goals',    question: 'What I want this year',             placeholder: 'A 405 deadlift and a sub-25 5K.' },
  { id: 'next-pr',             category: 'goals',    question: 'Next PR I am chasing',              placeholder: '3-plate bench by my birthday.' },
  { id: 'finish-line',         category: 'goals',    question: 'My finish line looks like',         placeholder: 'Houston Half — November.' },
  { id: 'consistency-win',     category: 'goals',    question: 'A consistency win I am proud of',   placeholder: '6 months, 4 days a week, no skips.' },

  // Energy / personality
  { id: 'workout-soundtrack',  category: 'energy',   question: 'My workout soundtrack',             placeholder: 'Houston rap. Loud. No skips.' },
  { id: 'pre-workout',         category: 'energy',   question: 'My pre-workout ritual',             placeholder: 'Black coffee, Sade, walk in.' },
  { id: 'post-workout-meal',   category: 'energy',   question: 'My post-workout meal',              placeholder: 'Eggs, rice, hot sauce, repeat.' },
  { id: 'hype-quote',          category: 'energy',   question: 'The line that gets me through reps',placeholder: '"One more. Always one more."' },
  { id: 'training-mood',       category: 'energy',   question: 'My current training mood',          placeholder: 'Quiet rage. The good kind.' },

  // Partner fit
  { id: 'ideal-partner',       category: 'partner',  question: "My ideal Partna shows up…",         placeholder: 'On time, headphones in, ready to work.' },
  { id: 'green-flag',          category: 'partner',  question: 'Green flag in a workout partner',   placeholder: 'They actually count my reps.' },
  { id: 'red-flag',            category: 'partner',  question: 'Red flag in a workout partner',     placeholder: 'Cancels Mondays.' },
  { id: 'spot-me-on',          category: 'partner',  question: 'Spot me on…',                       placeholder: 'Heavy bench. Talk me into the third rep.' },
  { id: 'unspoken-rules',      category: 'partner',  question: 'My unspoken gym rules',             placeholder: 'No phones between sets.' },

  // Lifestyle
  { id: 'outside-the-gym',     category: 'lifestyle',question: 'Outside the gym I am…',             placeholder: 'A dad, a chef on weekends, a bad domino player.' },
  { id: 'weekend-move',        category: 'lifestyle',question: 'My weekend move',                   placeholder: 'Hike Memorial, brunch, nap.' },
  { id: 'home-city',           category: 'lifestyle',question: 'Where I call home',                 placeholder: 'Cypress, but raised on Houston rap.' },
  { id: 'cheat-meal',          category: 'lifestyle',question: 'My non-negotiable cheat meal',      placeholder: 'Truffle fries. No discussion.' },
  { id: 'two-truths',          category: 'lifestyle',question: 'Two truths and a flex',             placeholder: 'I have hit 315. I have skipped a Monday. The flex is yours to find.' },
]

export function findPrompt(id: string): ProfilePrompt | undefined {
  return PROFILE_PROMPTS.find(p => p.id === id)
}

// Storage shape on profiles.profile_prompts (jsonb).
export type SavedPrompt = { id: string; answer: string }

export function sanitizePrompts(input: unknown): SavedPrompt[] {
  if (!Array.isArray(input)) return []
  const seen = new Set<string>()
  const out: SavedPrompt[] = []
  for (const item of input) {
    if (!item || typeof item !== 'object') continue
    const id = (item as { id?: unknown }).id
    const answer = (item as { answer?: unknown }).answer
    if (typeof id !== 'string' || typeof answer !== 'string') continue
    if (!findPrompt(id)) continue
    if (seen.has(id)) continue
    const trimmed = answer.trim().slice(0, PROMPT_ANSWER_MAX)
    if (!trimmed) continue
    seen.add(id)
    out.push({ id, answer: trimmed })
    if (out.length >= MAX_PROMPTS) break
  }
  return out
}

export function promptsByCategory(): Record<ProfilePromptCategory, ProfilePrompt[]> {
  const map = {
    identity:  [] as ProfilePrompt[],
    training:  [] as ProfilePrompt[],
    goals:     [] as ProfilePrompt[],
    energy:    [] as ProfilePrompt[],
    partner:   [] as ProfilePrompt[],
    lifestyle: [] as ProfilePrompt[],
  }
  for (const p of PROFILE_PROMPTS) map[p.category].push(p)
  return map
}

export const CATEGORY_LABEL: Record<ProfilePromptCategory, string> = {
  identity:  'About me',
  training:  'How I train',
  goals:     'What I am chasing',
  energy:    'My energy',
  partner:   'My ideal Partna',
  lifestyle: 'Outside the gym',
}
