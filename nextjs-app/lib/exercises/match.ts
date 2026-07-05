// Exercise reference matcher. Maps exercise names that appear in AI-generated
// workout text to entries in the bundled free-exercise-db dataset (db.json,
// 868 exercises, public domain — https://github.com/yuhonas/free-exercise-db)
// so the UI can show a photo and step-by-step instructions for each move.
//
// Server-side only: db.json is ~750 KB and must never reach the client
// bundle. Pages match on the server and pass only the matched entries down.

import db from './db.json'

export type ExerciseInfo = {
  id: string
  name: string
  level: string
  equipment: string | null
  primaryMuscles: string[]
  instructions: string[]
  images: string[]   // paths relative to the free-exercise-db repo
}

const EXERCISES = db as ExerciseInfo[]

// Images are hotlinked from the jsDelivr CDN mirror of the dataset repo —
// free, cached, and keeps ~40 MB of photos out of our repo/deploy.
export function exerciseImageUrl(imagePath: string): string {
  return `https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/${imagePath}`
}

/** Normalize a name for matching: lowercase, strip punctuation/filler. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[-–—/]/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\b(the|a|an|with|using|standing|seated)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Common AI-generated names → dataset names. The generator is also prompted
// to prefer dataset naming, but these cover the most frequent drift.
const ALIASES: Record<string, string> = {
  'squat': 'Barbell Squat',
  'back squat': 'Barbell Squat',
  'goblet squat': 'Goblet Squat',
  'bodyweight squat': 'Bodyweight Squat',
  'air squat': 'Bodyweight Squat',
  'deadlift': 'Barbell Deadlift',
  'romanian deadlift': 'Romanian Deadlift',
  'rdl': 'Romanian Deadlift',
  'bench press': 'Barbell Bench Press - Medium Grip',
  'push up': 'Pushups',
  'push ups': 'Pushups',
  'pushup': 'Pushups',
  'pull up': 'Pullups',
  'pull ups': 'Pullups',
  'pullup': 'Pullups',
  'chin up': 'Chin-Up',
  'overhead press': 'Standing Military Press',
  'shoulder press': 'Standing Military Press',
  'lunge': 'Bodyweight Walking Lunge',
  'lunges': 'Bodyweight Walking Lunge',
  'walking lunge': 'Bodyweight Walking Lunge',
  'plank': 'Plank',
  'side plank': 'Side Bridge',
  'glute bridge': 'Butt Lift (Bridge)',
  'hip bridge': 'Butt Lift (Bridge)',
  'bent over row': 'Bent Over Barbell Row',
  'dumbbell row': 'One-Arm Dumbbell Row',
  'lat pulldown': 'Wide-Grip Lat Pulldown',
  'bicep curl': 'Dumbbell Bicep Curl',
  'hammer curl': 'Hammer Curls',
  'tricep dip': 'Dips - Triceps Version',
  'dips': 'Dips - Triceps Version',
  'mountain climber': 'Mountain Climbers',
  'mountain climbers': 'Mountain Climbers',
  'jumping jack': 'Jumping Jacks',
  'jumping jacks': 'Jumping Jacks',
  'russian twist': 'Russian Twist',
  'crunch': 'Crunches',
  'crunches': 'Crunches',
  'sit up': '3/4 Sit-Up',
  'sit ups': '3/4 Sit-Up',
  'calf raise': 'Standing Calf Raises',
  'leg raise': 'Flat Bench Lying Leg Raise',
  'superman': 'Superman',
  'face pull': 'Face Pull',
  'chest fly': 'Dumbbell Flyes',
  'lateral raise': 'Side Lateral Raise',
  'front raise': 'Front Dumbbell Raise',
  'hip thrust': 'Barbell Hip Thrust',
  'step up': 'Dumbbell Step Ups',
  'step ups': 'Dumbbell Step Ups',
  'farmers carry': "Farmer's Walk",
  'farmers walk': "Farmer's Walk",
  'jump squat': 'Freehand Jump Squat',
  'squat jump': 'Freehand Jump Squat',
  'box jump': 'Box Jump (Multiple Response)',
  'bicycle crunch': 'Air Bike',
  'bicycle crunches': 'Air Bike',
  'dead bug': 'Dead Bug',
  'hip flexor stretch': 'Hip Flexion with Band',
  'cat cow': 'Cat Stretch',
  'cat camel': 'Cat Stretch',
  'chest stretch': 'Chest And Front Of Shoulder Stretch',
  'hamstring stretch': 'Standing Hamstring and Calf Stretch',
}

// Build lookup indexes once at module load.
const byNorm = new Map<string, ExerciseInfo>()
for (const ex of EXERCISES) byNorm.set(norm(ex.name), ex)

const aliasIndex = new Map<string, ExerciseInfo>()
for (const [alias, target] of Object.entries(ALIASES)) {
  const hit = byNorm.get(norm(target))
  if (hit) aliasIndex.set(norm(alias), hit)
}

/** Exact/alias lookup for a single exercise name. */
export function findExercise(name: string): ExerciseInfo | null {
  const n = norm(name)
  if (!n) return null
  return byNorm.get(n) ?? aliasIndex.get(n) ?? null
}

/**
 * Scan a blob of workout text for exercise names we know. Matches longest
 * names first so "dumbbell bench press" wins over "bench press". Returns
 * unique matches in order of first appearance, capped to keep payloads sane.
 */
export function matchExercisesInText(text: string, limit = 12): ExerciseInfo[] {
  let haystack = ` ${norm(text)} `
  const found: { idx: number; ex: ExerciseInfo }[] = []
  const seen = new Set<string>()

  const candidates: Array<[string, ExerciseInfo]> = []
  for (const [key, ex] of byNorm) candidates.push([key, ex])
  for (const [key, ex] of aliasIndex) candidates.push([key, ex])
  candidates.sort((a, b) => b[0].length - a[0].length)

  for (const [key, ex] of candidates) {
    if (key.length < 4) continue          // too short to match safely
    if (seen.has(ex.id)) continue
    const needle = ` ${key} `
    const idx = haystack.indexOf(needle)
    if (idx !== -1) {
      seen.add(ex.id)
      found.push({ idx, ex })
      // Consume the matched region so a shorter key can't re-match inside it
      // (e.g. the generic "squat" alias firing inside "goblet squat").
      haystack = haystack.split(needle).join(' # ')
    }
  }

  return found
    .sort((a, b) => a.idx - b.idx)
    .slice(0, limit)
    .map(f => f.ex)
}

/**
 * Names available for a given equipment context — used to bias the AI
 * generator toward names that will match photos. Keep the list small; it
 * goes into the prompt.
 */
export function exerciseNamesForEquipment(equipment: string[] | null | undefined, cap = 80): string[] {
  const eq = (equipment ?? []).map(e => e.toLowerCase())
  const wantBodyOnly = eq.length === 0 || eq.some(e => e.includes('none') || e.includes('body'))
  const wants = (ex: ExerciseInfo): boolean => {
    const e = (ex.equipment ?? '').toLowerCase()
    if (e === 'body only') return true
    if (wantBodyOnly && e !== 'body only') return false
    if (e === 'dumbbell' && eq.some(x => x.includes('dumbbell'))) return true
    if (e === 'barbell' && eq.some(x => x.includes('barbell') || x.includes('full gym'))) return true
    if (e === 'kettlebells' && eq.some(x => x.includes('kettlebell'))) return true
    if (e === 'bands' && eq.some(x => x.includes('band'))) return true
    if ((e === 'machine' || e === 'cable') && eq.some(x => x.includes('full gym') || x.includes('machine'))) return true
    return false
  }
  return EXERCISES.filter(wants).slice(0, cap).map(ex => ex.name)
}
