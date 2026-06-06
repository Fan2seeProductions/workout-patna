// Generate a daily workout plan. Uses Anthropic Claude when ANTHROPIC_API_KEY
// is set, falls back to a deterministic template otherwise.
//
// The system prompt is ported from the WorkoutPartna PRD master prompt
// (safety priorities, behavior rules, programming logic, readiness-driven
// adaptation). The output schema stays compact (focus/warm_up/main/finisher/
// notes + safety flag) so existing downstream callers — CoachShell,
// formatWorkoutMessage, the cron route — keep working without a rewrite.
// A future PR can adopt the doc's richer JSON schema with OpenAI
// Structured Outputs once the SMS surface is live.

import Anthropic from '@anthropic-ai/sdk'

export type Intake = {
  // Core fields used by the AI prompt + fallback template selection.
  goals?: string[] | null
  fitness_level?: string | null
  days_per_week?: number | null
  workout_minutes?: number | null
  equipment?: string[] | null
  injuries?: string | null
  target_areas?: string[] | null
  training_style?: string | null
  coaching_tone?: string | null

  // Optional richer profile. Wired into the user prompt below so the model
  // can actually use age, PRs, sleep, etc. for real personalization.
  age?: number | null
  sex?: string | null
  height_inches?: number
  weight_lbs?: number
  medical_conditions?: string | string[] | null
  medications?: string | string[] | null
  pregnancy_status?: string | null
  training_years?: number
  pr_bench_lbs?: number
  pr_squat_lbs?: number
  pr_deadlift_lbs?: number
  pr_mile_time?: string | null
  body_fat_pct?: number
  goal_target?: string | null
  goal_target_date?: string
  sleep_hours_avg?: number
  stress_level?: string | null
  occupation_activity?: string | null
  liked_exercises?: string | string[] | null
  disliked_exercises?: string | string[] | null
  cardio_preference?: string | string[] | null
  mobility_issues?: string | string[] | null
  plays_sports?: boolean | null
  sports?: string | string[] | null
  sport_level?: string | null
  sport_season?: string | null
  sport_position?: string | null
}

export type WorkoutPlan = {
  focus: string
  warm_up: string
  main: string
  finisher: string
  notes: string
  // Safety flag — when true, downstream UI should surface a "please talk
  // to a clinician / contact support" message instead of training cues.
  // Set by the model when the user reports something that warrants medical
  // attention (chest pain, fainting, severe injury, etc.).
  requires_human_review?: boolean
  human_review_reason?: string
}

// Yesterday's session context — callers pass this in so the model can
// nudge tomorrow's plan: same focus? scale back? push? skip?
export type AdaptationContext = {
  yesterdayFocus?: string | null
  yesterdayFeedback?: 'too_easy' | 'just_right' | 'too_hard' | 'injured' | null
  // Optional user-supplied reason when re-generating today's plan
  // (e.g. "I'm sore, give me upper body only").
  regenerateReason?: string | null
}

// ─────────────────────────────────────────────────────────────────────────
// Fallback templates — served when ANTHROPIC_API_KEY is missing or the
// model call fails. Templates are by training_style so the user gets
// something in their style even if the LLM is down.
// ─────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────
// Master system prompt — ports the WorkoutPartna PRD prompt package:
// identity, safety, coaching priorities, behavior rules, programming
// logic per goal, readiness adaptation, and style.
// ─────────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are WorkoutPartna, a highly reliable AI Trainer for general fitness and healthy habit formation.

Your job is to generate one personalized training plan for today.

You are not a doctor, physical therapist, dietitian, or emergency service. Do not diagnose, treat, or reassure about medical symptoms. If the user reports chest pain, fainting, severe shortness of breath, sudden injury, neurological symptoms, dangerous pain, pregnancy-related complications, or any other potentially urgent medical issue, do not provide a workout. Tell the user to seek medical care or emergency help as appropriate and set requires_human_review=true.

Your coaching priorities in order:
1. Safety
2. Adherence and consistency
3. Personalization to time, equipment, recovery, and goals
4. Clarity and motivation
5. Progressive overload over time

General behavior rules:
- Generate only workouts that fit the user's declared equipment, time budget, skill level, injuries, and environment.
- Default to the smallest effective workout when recovery, soreness, sleep, stress, or schedule is poor.
- Never punish missed days. Restart cleanly.
- Use plain English. Be concise and specific.
- Prefer one clear session over multiple options.
- Include warm-up, main work, and a short finisher when time allows.
- Include modifications if the user is tired, sore, traveling, or missing equipment.
- Use progressive overload only when recent adherence and recovery justify it.
- If the user is a beginner, emphasize technique, manageable volume, and confidence.
- If the user is returning after a break, reduce intensity and volume.
- If the user reports pain beyond normal training discomfort, reduce load or redirect away from the painful pattern.
- Do not mention policy or internal reasoning.
- Do not produce long explanations unless the channel needs it.

Programming logic per goal:
- fat_loss / lose weight: prioritize calorie expenditure, weekly consistency, and sustainable progression. Mix conditioning with strength so muscle is preserved.
- muscle_gain / build muscle: prioritize resistance training volume and progressive load. Target the major movement patterns across the week.
- strength / get stronger: prioritize the key barbell lifts, lower reps, longer rest, and recovery. Quality over volume.
- general_fitness: prioritize balanced movement and adherence. Mix push/pull/squat/hinge/carry/core/conditioning/mobility across the week.
- endurance: prioritize aerobic capacity. Mix steady-state with intervals; don't stack hard sessions back-to-back.
- mobility / flexibility: prioritize pain-free range, tissue prep, and low fatigue. Treat as recovery work.

Readiness adaptation:
- If recovery is low (poor sleep, soreness, high stress, low motivation, recent illness): choose recovery, walk, mobility, zone 2, or shortened strength work.
- If recovery is high and workload tolerance is established: progress slightly by load, reps, density, or complexity — not all at once.
- If the previous session feedback was too_hard or injured: deload today and switch focus.
- If the previous session feedback was too_easy: progress modestly today.
- If today is already the same focus as yesterday and rest isn't called for, rotate the movement pattern.

Style-specific notes:
- training_style "peloton": center on indoor cycling intervals using cadence (RPM) and resistance/Power Zone language. Add a short off-bike core or mobility finisher.
- training_style "work from home": assume ZERO equipment beyond a chair and a doorway. Bodyweight only. Keep noise low (no jumping jacks, prefer marching). Fits in a small room.
- training_style "desk worker": this is a posture / mobility / circulation reset, not a hard training session. Focus on hip flexors, thoracic spine, shoulders, neck, and gentle bodyweight strength. Should be doable in office clothes.

Output rules:
Return ONLY valid minified JSON in this exact shape, no markdown, no commentary, no preamble:
{"focus":"...","warm_up":"...","main":"...","finisher":"...","notes":"...","requires_human_review":false,"human_review_reason":""}

Field rules:
- focus: short title for the day (e.g., "Lower body strength", "Upper body push", "Recovery walk").
- warm_up: 2 to 4 lines, comma separated.
- main: the actual workout with clear sets x reps notation and rest cues.
- finisher: 3 to 5 minutes of higher-intensity work or core, OR an empty string if today is a recovery/mobility day.
- notes: 1 to 2 short lines of coaching cues, form reminders, or substitutions. No emojis. No hype.
- requires_human_review: true ONLY if the user reported a potentially urgent medical issue or a contraindication for training. If true, set focus="Talk to a clinician", main="" (or a very short safe instruction), and put a one-line reason in human_review_reason.
- human_review_reason: empty string when requires_human_review=false.

Style: coach-like, calm, direct. Never shaming. Encouraging without hype. Specific over clever. Practical over inspirational.`

// ─────────────────────────────────────────────────────────────────────────
// Helpers for assembling the user-side context block.
// ─────────────────────────────────────────────────────────────────────────
function arrToStr(v: string | string[] | null | undefined): string {
  if (!v) return ''
  if (Array.isArray(v)) return v.filter(Boolean).join(', ')
  return v
}

function buildUserPrompt(
  intake: Intake | null,
  adaptation: AdaptationContext | null | undefined,
): string {
  const i = intake ?? {}
  const a = adaptation ?? {}
  const today = new Date().toISOString().slice(0, 10)

  const lines: string[] = [
    `Generate today's WorkoutPartna training plan from the following context.`,
    ``,
    `DATE: ${today}`,
    ``,
    `GOALS: ${(i.goals ?? []).join(', ') || 'general fitness'}`,
    `Goal target: ${i.goal_target ?? 'not specified'}${i.goal_target_date ? ` by ${i.goal_target_date}` : ''}`,
    ``,
    `PROFILE:`,
    `- Fitness level: ${i.fitness_level ?? 'intermediate'}`,
    `- Training age (years): ${i.training_years ?? 'unknown'}`,
    `- Age: ${i.age ?? 'not provided'}`,
    `- Sex: ${i.sex ?? 'not provided'}`,
    i.height_inches ? `- Height: ${i.height_inches} in` : '',
    i.weight_lbs ? `- Weight: ${i.weight_lbs} lb` : '',
    i.body_fat_pct ? `- Body fat: ${i.body_fat_pct}%` : '',
    ``,
    `CONSTRAINTS:`,
    `- Days per week: ${i.days_per_week ?? 3}`,
    `- Available minutes today: ${i.workout_minutes ?? 45}`,
    `- Equipment: ${(i.equipment ?? ['gym']).join(', ')}`,
    `- Target areas: ${(i.target_areas ?? []).join(', ') || 'full body'}`,
    `- Training style: ${i.training_style ?? 'mixed'}`,
    `- Coaching tone: ${i.coaching_tone ?? 'encouraging'}`,
    `- Cardio preference: ${arrToStr(i.cardio_preference) || 'no preference'}`,
    `- Liked exercises: ${arrToStr(i.liked_exercises) || 'none specified'}`,
    `- Disliked exercises: ${arrToStr(i.disliked_exercises) || 'none specified'}`,
    `- Occupation activity level: ${i.occupation_activity ?? 'unknown'}`,
    ``,
    `HEALTH FLAGS:`,
    `- Injuries / limitations: ${i.injuries ?? 'none reported'}`,
    `- Mobility issues: ${arrToStr(i.mobility_issues) || 'none reported'}`,
    `- Medical conditions: ${arrToStr(i.medical_conditions) || 'none reported'}`,
    `- Medications: ${arrToStr(i.medications) || 'none reported'}`,
    `- Pregnancy status: ${i.pregnancy_status ?? 'not applicable / not provided'}`,
    ``,
    `RECOVERY & READINESS (best signals we have):`,
    `- Avg sleep hours: ${i.sleep_hours_avg ?? 'unknown'}`,
    `- Stress level: ${i.stress_level ?? 'unknown'}`,
    ``,
    `RECENT TRAINING CONTEXT:`,
    `- Yesterday's focus: ${a.yesterdayFocus ?? 'unknown / no record'}`,
    `- Yesterday's feedback: ${a.yesterdayFeedback ?? 'unknown / no feedback'}`,
    a.regenerateReason ? `- User regenerate reason: ${a.regenerateReason}` : '',
    ``,
    `PRs (if relevant):`,
    i.pr_bench_lbs ? `- Bench: ${i.pr_bench_lbs} lb` : '',
    i.pr_squat_lbs ? `- Squat: ${i.pr_squat_lbs} lb` : '',
    i.pr_deadlift_lbs ? `- Deadlift: ${i.pr_deadlift_lbs} lb` : '',
    i.pr_mile_time ? `- Mile time: ${i.pr_mile_time}` : '',
    ``,
    i.plays_sports
      ? `SPORTS:\n- ${[i.sports, i.sport_level, i.sport_position, i.sport_season ? `season: ${i.sport_season}` : null].map(arrToStr).filter(Boolean).join(' / ')}`
      : '',
    ``,
    `Generate one best workout for today. Return ONLY the JSON object — no markdown, no commentary.`,
  ]

  return lines.filter(l => l !== '').join('\n')
}

export async function generateWorkout(
  intake: Intake | null,
  adaptation?: AdaptationContext | null,
): Promise<WorkoutPlan> {
  const styleKey = (intake?.training_style ?? 'mixed').toLowerCase()
  const fallback = FALLBACK_TEMPLATES[styleKey] ?? FALLBACK_TEMPLATES.mixed

  if (!process.env.ANTHROPIC_API_KEY) {
    return fallback
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const userPrompt = buildUserPrompt(intake, adaptation)

    const res = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = res.content
      .filter(b => b.type === 'text')
      .map(b => (b as { text: string }).text)
      .join('')

    // Tolerate stray whitespace or accidental markdown fences. The prompt
    // says "no markdown" but defending against it costs nothing.
    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
    const parsed = JSON.parse(cleaned) as WorkoutPlan

    // Validate the safety contract: if requires_human_review is true, the
    // UI surface should NOT show training cues, regardless of what's in
    // main/warm_up. We trust the model on the boolean and pass through.
    if (parsed.requires_human_review) {
      return {
        focus: parsed.focus || 'Talk to a clinician',
        warm_up: '',
        main: parsed.main || '',
        finisher: '',
        notes: parsed.notes || 'Reach out to a healthcare provider before continuing training.',
        requires_human_review: true,
        human_review_reason: parsed.human_review_reason || 'Reported a potential safety concern.',
      }
    }

    if (!parsed.focus || !parsed.main) throw new Error('bad shape')
    return parsed
  } catch {
    return fallback
  }
}
