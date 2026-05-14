// Generate a daily workout plan. Uses Anthropic Claude when ANTHROPIC_API_KEY is set,
// falls back to a deterministic template otherwise. Returns plain text sections.

import Anthropic from '@anthropic-ai/sdk'

export type Intake = {
  goals?: string[] | null
  fitness_level?: string | null
  days_per_week?: number | null
  workout_minutes?: number | null
  equipment?: string[] | null
  injuries?: string | null
  target_areas?: string[] | null
  training_style?: string | null
  coaching_tone?: string | null

  // Tier 1: programming safety (added 2026-05-08)
  age?: number | null
  sex?: string | null
  height_inches?: number | null
  weight_lbs?: number | null
  medical_conditions?: string[] | null
  medications?: string | null
  pregnancy_status?: string | null

  // Tier 2: programming quality
  training_years?: number | null
  pr_bench_lbs?: number | null
  pr_squat_lbs?: number | null
  pr_deadlift_lbs?: number | null
  pr_mile_time?: string | null
  body_fat_pct?: number | null
  goal_target?: string | null
  goal_target_date?: string | null
  sleep_hours_avg?: number | null
  stress_level?: string | null
  occupation_activity?: string | null

  // Tier 3: personalization
  liked_exercises?: string | null
  disliked_exercises?: string | null
  cardio_preference?: string[] | null
  mobility_issues?: string | null

  // Sports performance
  plays_sports?:   boolean | null
  sports?:         string[] | null
  sport_level?:    string | null   // recreational | competitive | semi-pro | pro
  sport_season?:   string | null   // in-season | off-season | pre-season
  sport_position?: string | null

  // SMS delivery opt-in (TCPA-compliant)
  phone_number?: string | null
  sms_opt_in?: boolean | null
}

export type WorkoutPlan = {
  focus: string
  warm_up: string
  main: string
  finisher: string
  notes: string
}

export type AdaptationContext = {
  yesterdayFocus?: string | null
  yesterdayFeedback?: 'too_easy' | 'too_hard' | 'sore' | 'skipped' | 'completed' | null
  /** When set, instructs Claude to produce a different plan than what the user already saw today. */
  regenerateReason?: string | null
}

const FALLBACK_TEMPLATES: Record<string, WorkoutPlan> = {
  strength: {
    focus: 'Lower body strength',
    warm_up: '5 min easy cardio. 10 bodyweight squats. 10 glute bridges. 10 walking lunges.',
    main: 'Back squat 4 x 6. Romanian deadlift 4 x 8. Walking lunge 3 x 10/leg. Leg press 3 x 12.',
    finisher: '3 rounds: 20 goblet squats, 15 hip thrusts, 30s plank.',
    notes: 'Rest 90 to 120 seconds between heavy sets. If you feel sharp pain, drop the weight or skip.',
  },
  hypertrophy: {
    focus: 'Upper body push',
    warm_up: '5 min row or bike. Band pull-aparts 2 x 15. Arm circles 30s each direction.',
    main: 'Bench press 4 x 8. Overhead press 3 x 10. Incline DB press 3 x 12. Tricep pushdown 3 x 12.',
    finisher: '2 rounds: max push-ups, 20 banded lateral raises, 15 dips.',
    notes: 'Squeeze at the top of every rep. Stop 1 to 2 reps before failure on the last set.',
  },
  endurance: {
    focus: 'Aerobic conditioning',
    warm_up: '5 min easy jog. Dynamic leg swings. World\'s greatest stretch 5 each side.',
    main: 'Run 20 min at conversational pace. Then 6 x 30s hill or fast intervals with 90s recovery.',
    finisher: '5 min cool-down walk. Calf and hip flexor stretches.',
    notes: 'If knees or shins ache, swap the run for a 25 min bike at moderate intensity.',
  },
  mixed: {
    focus: 'Full body conditioning',
    warm_up: '3 min jump rope. World\'s greatest stretch 5/side. 10 push-ups, 10 squats, 10 rows.',
    main: '4 rounds: 12 goblet squats, 10 push-ups, 10 dumbbell rows/side, 30s mountain climbers, 60s rest.',
    finisher: 'EMOM 8 min: even minutes 12 KB swings, odd minutes 30s plank.',
    notes: 'Move with control. Form first, speed second.',
  },
}

export async function generateWorkout(
  intake: Intake | null,
  ctx: AdaptationContext = {},
): Promise<WorkoutPlan> {
  const styleKey = (intake?.training_style ?? 'mixed').toLowerCase()
  const fallback = FALLBACK_TEMPLATES[styleKey] ?? FALLBACK_TEMPLATES.mixed

  if (!process.env.ANTHROPIC_API_KEY) {
    return fallback
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const sys = `You are an experienced strength and conditioning coach (NSCA-CSCS, NASM-CPT certified). Generate a single day's workout plan based on the user's intake and any feedback from their previous session. Return ONLY valid minified JSON in this exact shape, no markdown, no commentary:
{"focus":"...","warm_up":"...","main":"...","finisher":"...","notes":"..."}
Rules:
- focus: short title for the day (e.g., "Lower body strength")
- warm_up: 2 to 4 lines, comma separated
- main: the actual workout with sets x reps notation. When you have the user's
  current PRs (bench/squat/deadlift), prescribe loads as % of those PRs
  (e.g., "Back squat 4 x 6 @ 75% (≈225 lbs based on 300 lb PR)").
- finisher: 3 to 5 minutes of higher-intensity work or core
- notes: 1 to 2 lines of coaching cues or substitutions
- Match the user's coaching tone if provided
- Respect injuries, medical conditions, mobility issues, equipment constraints
- Keep the whole plan completable in the user's available minutes
- AGE-APPROPRIATE programming: under 25 → tolerate higher volume; 26–45 →
  standard; 46+ → reduce impact/volume, longer warm-ups, more recovery work
- SLEEP-AWARE: if user reports <6 hrs sleep avg → reduce volume 15–25%
- HIGH STRESS or HEAVY OCCUPATION ACTIVITY → reduce volume, prioritize recovery
- PREGNANCY: avoid supine positions after 1st trimester, no high-impact, no
  abdominal flexion in 2nd/3rd trimester, defer to OB clearance
- DISLIKED EXERCISES: do not prescribe (substitute with similar movement pattern)
- LIKED EXERCISES: include when they fit the day's focus
- ADAPT to yesterday's feedback when given:
  * "too_hard" or "sore"  → deload 10–15%, swap to lower-impact movements
  * "too_easy"            → add 1–2 sets, 5–10% more weight, or harder progressions
  * "skipped"             → keep load similar, treat as a fresh start
  * "completed"           → progress slightly, vary movement patterns
- Avoid hitting the same primary movement pattern as yesterday`

    const adaptation = ctx.yesterdayFocus || ctx.yesterdayFeedback
      ? `\n\nYesterday's session:\n- Focus: ${ctx.yesterdayFocus ?? 'unknown'}\n- User feedback: ${ctx.yesterdayFeedback ?? 'none recorded'}`
      : ''

    const regen = ctx.regenerateReason
      ? `\n\nIMPORTANT: The user requested a different workout for today. Reason: "${ctx.regenerateReason}". Produce a meaningfully different plan — different focus area or movement style — not just a reworded version.`
      : ''

    // Build conditional sections so we don't pollute the prompt with empty fields
    const fmt = (v: unknown): string =>
      v == null || v === '' ? '(not provided)'
      : Array.isArray(v) ? (v.length ? v.join(', ') : '(not provided)')
      : String(v)

    const tier1 = `\n\n— Demographics & safety —
- Age: ${fmt(intake?.age)}
- Sex: ${fmt(intake?.sex)}
- Height (in): ${fmt(intake?.height_inches)}
- Weight (lbs): ${fmt(intake?.weight_lbs)}
- Medical conditions: ${fmt(intake?.medical_conditions)}
- Medications: ${fmt(intake?.medications)}
- Pregnancy/postpartum status: ${fmt(intake?.pregnancy_status)}`

    const tier2 = `\n\n— Training history & current state —
- Years training: ${fmt(intake?.training_years)}
- PR bench (lbs): ${fmt(intake?.pr_bench_lbs)}
- PR squat (lbs): ${fmt(intake?.pr_squat_lbs)}
- PR deadlift (lbs): ${fmt(intake?.pr_deadlift_lbs)}
- PR mile time: ${fmt(intake?.pr_mile_time)}
- Body fat %: ${fmt(intake?.body_fat_pct)}
- Specific goal target: ${fmt(intake?.goal_target)}
- Goal target date: ${fmt(intake?.goal_target_date)}
- Avg sleep (hrs): ${fmt(intake?.sleep_hours_avg)}
- Stress level: ${fmt(intake?.stress_level)}
- Occupation activity level: ${fmt(intake?.occupation_activity)}`

    const tier3 = `\n\n— Personalization —
- Liked exercises: ${fmt(intake?.liked_exercises)}
- Disliked exercises (DO NOT prescribe): ${fmt(intake?.disliked_exercises)}
- Cardio preference: ${fmt(intake?.cardio_preference)}
- Mobility issues: ${fmt(intake?.mobility_issues)}`

    const sportsBlock = intake?.plays_sports
      ? `\n\n— Sport performance (IMPORTANT — shape the entire program around this) —
- Sport(s): ${fmt(intake?.sports)}
- Competition level: ${fmt(intake?.sport_level)}
- Current season: ${fmt(intake?.sport_season)}
- Position / role: ${fmt(intake?.sport_position)}
Sport programming rules:
* IN-SEASON → prioritize maintenance + injury prevention; reduce max-effort lifts to 70–80% of off-season loads; keep sessions short; emphasize unilateral stability, mobility, and CNS recovery
* PRE-SEASON → ramp volume and sport-specific conditioning; power development; increase agility drills in finisher
* OFF-SEASON → foundation building; higher volume hypertrophy/strength is appropriate; address weak points for next season
* SPORT-SPECIFIC movement patterns: basketball/soccer → explosive lower body + lateral agility; football → power, contact readiness, neck/trap work; baseball/softball → rotational power, shoulder health, grip; combat sports → full-body conditioning, grip, neck; endurance sports (cycling, running, swimming) → aerobic base, injury prevention, not heavy barbell work
* COMPETITION-LEVEL scaling: recreational → general fitness is primary; competitive → sport specificity is primary; semi-pro/pro → periodization required, fatigue management is critical`
      : ''

    const user = `User intake:
- Goals: ${(intake?.goals ?? []).join(', ') || 'general fitness'}
- Fitness level: ${intake?.fitness_level ?? 'intermediate'}
- Days per week: ${intake?.days_per_week ?? 3}
- Available minutes: ${intake?.workout_minutes ?? 45}
- Equipment: ${(intake?.equipment ?? ['gym']).join(', ')}
- Target areas: ${(intake?.target_areas ?? []).join(', ') || 'full body'}
- Training style: ${intake?.training_style ?? 'mixed'}
- Coaching tone: ${intake?.coaching_tone ?? 'encouraging'}
- Injuries: ${intake?.injuries ?? 'none'}${tier1}${tier2}${tier3}${sportsBlock}${adaptation}${regen}

Generate today's workout.`

    const res = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 800,
      system: sys,
      messages: [{ role: 'user', content: user }],
    })

    const text = res.content
      .filter(b => b.type === 'text')
      .map(b => (b as { text: string }).text)
      .join('')

    const parsed = JSON.parse(text) as WorkoutPlan
    if (!parsed.focus || !parsed.main) throw new Error('bad shape')
    return parsed
  } catch {
    return fallback
  }
}
