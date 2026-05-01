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
}

export type WorkoutPlan = {
  focus: string
  warm_up: string
  main: string
  finisher: string
  notes: string
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

export async function generateWorkout(intake: Intake | null): Promise<WorkoutPlan> {
  const styleKey = (intake?.training_style ?? 'mixed').toLowerCase()
  const fallback = FALLBACK_TEMPLATES[styleKey] ?? FALLBACK_TEMPLATES.mixed

  if (!process.env.ANTHROPIC_API_KEY) {
    return fallback
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const sys = `You are an experienced strength and conditioning coach. Generate a single day's workout plan based on the user's intake. Return ONLY valid minified JSON in this exact shape, no markdown, no commentary:
{"focus":"...","warm_up":"...","main":"...","finisher":"...","notes":"..."}
Rules:
- focus: short title for the day (e.g., "Lower body strength")
- warm_up: 2 to 4 lines, comma separated
- main: the actual workout with sets x reps notation
- finisher: 3 to 5 minutes of higher-intensity work or core
- notes: 1 to 2 lines of coaching cues or substitutions
- Match the user's coaching tone if provided
- Respect injuries and equipment constraints
- Keep the whole plan completable in the user's available minutes`

    const user = `User intake:
- Goals: ${(intake?.goals ?? []).join(', ') || 'general fitness'}
- Fitness level: ${intake?.fitness_level ?? 'intermediate'}
- Days per week: ${intake?.days_per_week ?? 3}
- Available minutes: ${intake?.workout_minutes ?? 45}
- Equipment: ${(intake?.equipment ?? ['gym']).join(', ')}
- Target areas: ${(intake?.target_areas ?? []).join(', ') || 'full body'}
- Training style: ${intake?.training_style ?? 'mixed'}
- Coaching tone: ${intake?.coaching_tone ?? 'encouraging'}
- Injuries: ${intake?.injuries ?? 'none'}

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
