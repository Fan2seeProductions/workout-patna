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
  peloton: {
    focus: 'Bike intervals + core',
    warm_up: '5 min easy spin at 60-70 RPM, resistance 25-35. Add 2 x 20s pickups in the last minute.',
    main: 'Power Zone or HR-based intervals: 4 rounds of 4 min @ Zone 4 (hard but sustainable) with 2 min @ Zone 2 recovery. Hold cadence 80-95 in the work, 70-80 in the recovery.',
    finisher: 'Off the bike: 3 rounds of 12 plank shoulder taps, 15 dead bugs, 20s side plank each side.',
    notes: 'If you don\'t have a Peloton, sub any indoor bike with adjustable resistance. Hydrate. Stretch hip flexors after.',
  },
  'work from home': {
    focus: 'No-equipment full body',
    warm_up: '2 min march in place. 10 arm circles each way. 10 cat-cows. 10 bodyweight squats. 10 hip openers.',
    main: '5 rounds, minimal rest: 15 squats, 10 push-ups (knees if needed), 12 reverse lunges total, 10 hip hinges, 30s plank, 20 mountain climbers.',
    finisher: '2 rounds: 15 glute bridges, 20 bicycle crunches, 30s wall sit.',
    notes: 'Zero equipment, fits in any room. Take 30-60s between rounds. Modify push-ups to incline (against a counter) if shoulders aren\'t happy.',
  },
  'desk worker': {
    focus: 'Posture + mobility reset',
    warm_up: '30s neck circles each way. 10 shoulder rolls back. 10 cat-cows. 10 standing thoracic rotations each side.',
    main: '3 rounds: 15 chair squats, 10 desk push-ups (or wall push-ups), 12 standing rows w/ band or towel, 10 glute bridges, 30s door-frame chest stretch, 30s hip flexor stretch each side.',
    finisher: '5 min walk + 10 standing forward folds (slow, controlled).',
    notes: 'Built for tight hips, rounded shoulders, and a stiff neck. Do this anytime you\'ve been at a screen for 90+ min. No equipment needed.',
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
- Keep the whole plan completable in the user's available minutes
- If training style is "peloton": center the workout on indoor cycling intervals using cadence (RPM) and resistance/Power Zone language. Add a short off-bike core or mobility finisher.
- If training style is "work from home": assume ZERO equipment beyond a chair and a doorway. Bodyweight only. Keep noise low (no jumping jacks, prefer marching). Fits in a small room.
- If training style is "desk worker": this is a posture / mobility / circulation reset, not a hard training session. Focus on hip flexors, thoracic spine, shoulders, neck, and gentle bodyweight strength. Should be doable in office clothes.`

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
