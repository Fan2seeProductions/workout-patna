// Server action: on-demand "Desk Break" micro-workout generator.
//
// Unlike the daily cron workout (Opus, saved to ai_workouts), desk breaks are
// instant, stateless, and cheap: a small model generates a 5–15 minute
// context-appropriate routine, we attach photo/how-to cards from the bundled
// exercise database, and nothing is written to the DB. If the API is down or
// unconfigured, a solid static routine ships instead — the member always
// gets a break workout.
'use server'

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '../supabase/server'
import { matchExercisesInText, exerciseImageUrl } from '../exercises/match'
import type { GuideItem } from '../../components/app/ExerciseGuide'

export type DeskContext =
  | 'desk'          // seated at a desk, office clothes
  | 'standing'      // standing desk / small office
  | 'hotel'         // hotel room, no equipment
  | 'bands'         // resistance bands available
  | 'no-equipment'  // any room, bodyweight

export type DeskBreak = {
  title: string
  moves: { name: string; prescription: string }[]
  note: string
  guide: GuideItem[]
}

const CONTEXT_BRIEF: Record<DeskContext, string> = {
  'desk':
    'Seated/standing at an office desk in work clothes. No sweating, no lying on the floor, quiet moves only. Focus: neck, shoulders, thoracic spine, hip flexors, glutes, circulation.',
  'standing':
    'Standing desk or small office space in work clothes. Quiet, low-sweat, no floor work. Focus: posture, hips, calves/circulation, shoulders.',
  'hotel':
    'Hotel room. No equipment. Floor work is fine, light sweat is fine. Focus: full-body circulation and mobility after travel.',
  'bands':
    'Has a resistance band. Small space, moderate effort ok. Focus: pulls and posture work that undo sitting (rows, pull-aparts, band stretches).',
  'no-equipment':
    'Any room at home. Bodyweight only, moderate effort ok. Focus: full-body reset — squat, hinge, push, core, hips.',
}

// Always-works routines if the model call fails or no API key is set.
const FALLBACKS: Record<DeskContext, Omit<DeskBreak, 'guide'>> = {
  'desk': {
    title: 'Desk posture reset',
    moves: [
      { name: 'Neck circles', prescription: '30 seconds each direction, slow' },
      { name: 'Shoulder rolls', prescription: '10 backward, 10 forward' },
      { name: 'Chair squats', prescription: '2 × 12, stand fully each rep' },
      { name: 'Desk push-ups', prescription: '2 × 10 against the desk edge' },
      { name: 'Hip flexor stretch', prescription: '30 seconds each side, standing' },
    ],
    note: 'Do this every 90 minutes of sitting. Breathe through the stretches.',
  },
  'standing': {
    title: 'Standing desk reset',
    moves: [
      { name: 'Standing thoracic rotations', prescription: '10 each side, slow' },
      { name: 'Standing Calf Raises', prescription: '2 × 15' },
      { name: 'Bodyweight Squat', prescription: '2 × 12' },
      { name: 'Standing Hamstring and Calf Stretch', prescription: '30 seconds each leg' },
      { name: 'Shoulder rolls', prescription: '10 backward, 10 forward' },
    ],
    note: 'Shift weight, move often. This resets your hips and calves.',
  },
  'hotel': {
    title: 'Hotel room shake-out',
    moves: [
      { name: 'Jumping Jacks', prescription: '2 × 30 seconds (march in place if quiet hours)' },
      { name: 'Bodyweight Squat', prescription: '2 × 15' },
      { name: 'Pushups', prescription: '2 × 10 (knees or incline fine)' },
      { name: 'Cat Stretch', prescription: '10 slow reps' },
      { name: 'Plank', prescription: '2 × 30 seconds' },
    ],
    note: 'Travel stiffness lives in the hips and upper back — go slow on the cat stretch.',
  },
  'bands': {
    title: 'Band posture break',
    moves: [
      { name: 'Band pull-aparts', prescription: '2 × 15' },
      { name: 'Standing band rows', prescription: '2 × 12' },
      { name: 'Band overhead press', prescription: '2 × 10, light' },
      { name: 'Bodyweight Squat', prescription: '2 × 12' },
      { name: 'Chest And Front Of Shoulder Stretch', prescription: '30 seconds' },
    ],
    note: 'Pulls beat pushes when you sit all day. Keep the band work smooth.',
  },
  'no-equipment': {
    title: 'Living-room reset',
    moves: [
      { name: 'Bodyweight Squat', prescription: '2 × 15' },
      { name: 'Pushups', prescription: '2 × 10' },
      { name: 'Butt Lift (Bridge)', prescription: '2 × 12' },
      { name: 'Mountain Climbers', prescription: '2 × 20 seconds' },
      { name: 'Cat Stretch', prescription: '8 slow reps' },
    ],
    note: 'Five moves, one room, no excuses. Rest 30 seconds between rounds.',
  },
}

function attachGuide(b: Omit<DeskBreak, 'guide'>): DeskBreak {
  const text = b.moves.map(m => m.name).join('\n')
  const guide: GuideItem[] = matchExercisesInText(text, 8).map(ex => ({
    id: ex.id,
    name: ex.name,
    level: ex.level,
    muscles: ex.primaryMuscles,
    imageUrls: ex.images.map(exerciseImageUrl),
    steps: ex.instructions,
  }))
  return { ...b, guide }
}

export async function generateDeskBreak(
  context: DeskContext,
  minutes: 5 | 10 | 15,
): Promise<{ ok: boolean; breakWorkout?: DeskBreak; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Sign in required.' }

  const brief = CONTEXT_BRIEF[context]
  if (!brief) return { ok: false, error: 'Unknown context.' }

  const fallback = FALLBACKS[context]

  if (!process.env.ANTHROPIC_API_KEY) {
    return { ok: true, breakWorkout: attachGuide(fallback) }
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    // Micro-workouts don't need the flagship model — fast + cheap wins here.
    const model = process.env.ANTHROPIC_MICRO_MODEL ?? 'claude-haiku-4-5-20251001'

    const res = await client.messages.create({
      model,
      max_tokens: 600,
      messages: [{
        role: 'user',
        content:
          `You are WorkoutPartna's AI coach. Build a ${minutes}-minute micro-workout break.\n` +
          `Context: ${brief}\n\n` +
          `Rules: 4-6 moves. Use common canonical exercise names (e.g. "Bodyweight Squat", "Pushups", "Plank", "Cat Stretch") — the app attaches photo cards by name. ` +
          `Each move gets a short prescription (sets × reps or time). One short coaching note at the end. No hype, no emojis.\n\n` +
          `Return ONLY minified JSON: {"title":"...","moves":[{"name":"...","prescription":"..."}],"note":"..."}`,
      }],
    })

    const text = res.content.filter(b => b.type === 'text').map(b => (b as { text: string }).text).join('')
    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
    const parsed = JSON.parse(cleaned) as Omit<DeskBreak, 'guide'>
    if (!parsed.title || !Array.isArray(parsed.moves) || !parsed.moves.length) throw new Error('bad shape')

    return { ok: true, breakWorkout: attachGuide(parsed) }
  } catch (err) {
    console.error('[desk-break] generation failed, using fallback:', (err as Error).message)
    return { ok: true, breakWorkout: attachGuide(fallback) }
  }
}
