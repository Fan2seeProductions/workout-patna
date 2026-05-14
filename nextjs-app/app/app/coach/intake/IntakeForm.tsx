// Multi-step AI Coach intake — captures everything a coach needs to write a
// safe, effective, personalized program. Saves on submit, then redirects to
// /app/coach. Last step requires the user to accept the health/liability
// acknowledgment before the submit button activates.
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveIntake } from '../../../../lib/actions/coach'
import { BackIcon, BrainIcon } from '../../../../components/app/icons'
import {
  DISCLAIMER_VERSION, DISCLAIMER_TITLE, DISCLAIMER_INTRO, DISCLAIMER_POINTS,
  DISCLAIMER_ACCEPT_LABEL, FULL_WAIVER_PATH,
} from '../../../../lib/legal/coach-disclaimer'
import {
  SMS_OPT_IN_VERSION, SMS_OPT_IN_HEADING, SMS_OPT_IN_INTRO,
  SMS_OPT_IN_DISCLOSURE, SMS_OPT_IN_LABEL, normalizePhoneNumber,
} from '../../../../lib/legal/sms-opt-in'

type Initial = {
  // Existing
  goals?: string[] | null
  fitness_level?: string | null
  days_per_week?: number | null
  workout_minutes?: number | null
  equipment?: string[] | null
  injuries?: string | null
  target_areas?: string[] | null
  training_style?: string | null
  delivery_time?: string | null
  coaching_tone?: string | null
  // New tier 1
  age?: number | null
  sex?: string | null
  height_inches?: number | null
  weight_lbs?: number | null
  medical_conditions?: string[] | null
  medications?: string | null
  pregnancy_status?: string | null
  // New tier 2
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
  // New tier 3
  liked_exercises?: string | null
  disliked_exercises?: string | null
  cardio_preference?: string[] | null
  mobility_issues?: string | null
  // Sports
  plays_sports?: boolean | null
  sports?: string[] | null
  sport_level?: string | null
  sport_season?: string | null
  sport_position?: string | null
  // SMS delivery
  phone_number?: string | null
  sms_opt_in?: boolean | null
  // Disclaimer
  disclaimer_accepted?: boolean | null
  disclaimer_version?: string | null
} | null

const GOALS = ['Build Muscle','Lose Weight','Get Stronger','Endurance','Flexibility','Sport Performance']
const LEVELS = ['Beginner','Intermediate','Advanced','Athlete']
const EQUIPMENT = ['Full Gym','Dumbbells','Barbell','Bodyweight','Bands','Pull-up bar','Treadmill','Kettlebell']
const AREAS = ['Legs','Upper body','Core','Glutes','Back','Arms','Cardio']
const STYLES = ['strength','hypertrophy','endurance','mixed'] as const
const TONES = ['encouraging','tough','clinical'] as const
const TIMES = ['06:00','07:00','08:00','12:00','17:00','18:00','19:00','21:00']
const SEXES = ['male','female','non-binary','prefer-not-to-say']
const PREGNANCY = ['none','pregnant','postpartum','trying']
const STRESS_LEVELS = ['low','moderate','high','very-high']
const OCCUPATION = ['sedentary','light','moderate','heavy']
const CARDIO_PREFS = ['Run','Bike','Row','Walk','Swim','HIIT','None']
const MEDICAL = [
  'High blood pressure','Heart condition','Diabetes (type 1)','Diabetes (type 2)',
  'Asthma','Joint replacement','Arthritis','Recent surgery','Chronic pain','None',
]
const SPORT_LEVELS = ['Recreational','Competitive','Semi-pro','Pro']
const SPORT_SEASONS = ['In-season','Pre-season','Off-season']
const COMMON_SPORTS = [
  'Basketball','Football','Soccer','Baseball','Softball','Tennis','Golf',
  'Swimming','Track & Field','Wrestling','MMA / Boxing','Volleyball',
  'Cycling','CrossFit','Powerlifting','Olympic Lifting','Other',
]

const TOTAL_STEPS = 6

export function IntakeForm({ initial }: { initial: Initial }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)

  // ─── Existing fields ────────────────────────────────────────────────
  const [goals, setGoals] = useState(new Set(initial?.goals ?? []))
  const [level, setLevel] = useState(initial?.fitness_level ?? '')
  const [days, setDays] = useState(initial?.days_per_week ?? 3)
  const [minutes, setMinutes] = useState(initial?.workout_minutes ?? 45)
  const [equipment, setEquipment] = useState(new Set(initial?.equipment ?? ['Full Gym']))
  const [areas, setAreas] = useState(new Set(initial?.target_areas ?? []))
  const [style, setStyle] = useState<typeof STYLES[number]>((initial?.training_style as typeof STYLES[number]) ?? 'mixed')
  const [tone, setTone] = useState<typeof TONES[number]>((initial?.coaching_tone as typeof TONES[number]) ?? 'encouraging')
  const [time, setTime] = useState(initial?.delivery_time ?? '07:00')
  const [injuries, setInjuries] = useState(initial?.injuries ?? '')

  // ─── Tier 1: demographics & safety ─────────────────────────────────
  const [age, setAge] = useState(initial?.age ?? 30)
  const [sex, setSex] = useState(initial?.sex ?? '')
  const [heightFt, setHeightFt] = useState(
    initial?.height_inches ? Math.floor(initial.height_inches / 12) : 5,
  )
  const [heightIn, setHeightIn] = useState(
    initial?.height_inches ? initial.height_inches % 12 : 8,
  )
  const [weight, setWeight] = useState(initial?.weight_lbs ?? 170)
  const [medical, setMedical] = useState(new Set(initial?.medical_conditions ?? ['None']))
  const [medications, setMedications] = useState(initial?.medications ?? '')
  const [pregnancy, setPregnancy] = useState(initial?.pregnancy_status ?? 'none')

  // ─── Tier 2: training history & current state ──────────────────────
  const [trainingYears, setTrainingYears] = useState(initial?.training_years ?? 1)
  const [prBench, setPrBench] = useState(initial?.pr_bench_lbs?.toString() ?? '')
  const [prSquat, setPrSquat] = useState(initial?.pr_squat_lbs?.toString() ?? '')
  const [prDeadlift, setPrDeadlift] = useState(initial?.pr_deadlift_lbs?.toString() ?? '')
  const [prMile, setPrMile] = useState(initial?.pr_mile_time ?? '')
  const [bodyFat, setBodyFat] = useState(initial?.body_fat_pct?.toString() ?? '')
  const [goalTarget, setGoalTarget] = useState(initial?.goal_target ?? '')
  const [goalTargetDate, setGoalTargetDate] = useState(initial?.goal_target_date ?? '')
  const [sleep, setSleep] = useState(initial?.sleep_hours_avg ?? 7)
  const [stressLevel, setStressLevel] = useState(initial?.stress_level ?? 'moderate')
  const [occupation, setOccupation] = useState(initial?.occupation_activity ?? 'sedentary')

  // ─── Tier 3: personalization ───────────────────────────────────────
  const [liked, setLiked] = useState(initial?.liked_exercises ?? '')
  const [disliked, setDisliked] = useState(initial?.disliked_exercises ?? '')
  const [cardio, setCardio] = useState(new Set(initial?.cardio_preference ?? []))
  const [mobility, setMobility] = useState(initial?.mobility_issues ?? '')

  // ─── Sports ────────────────────────────────────────────────────────
  const [playsSports, setPlaysSports] = useState(initial?.plays_sports ?? false)
  const [selectedSports, setSelectedSports] = useState(new Set(initial?.sports ?? []))
  const [sportLevel, setSportLevel] = useState(initial?.sport_level ?? '')
  const [sportSeason, setSportSeason] = useState(initial?.sport_season ?? '')
  const [sportPosition, setSportPosition] = useState(initial?.sport_position ?? '')

  // ─── SMS delivery (CORE — daily texts are the product) ─────────────
  const [phoneNumber, setPhoneNumber] = useState(initial?.phone_number ?? '')
  // Default to opted-in. The AI Coach product premise is "daily workouts
  // texted to you," so opt-in is the expected baseline. Users can uncheck
  // if they specifically want in-app-only delivery.
  const [smsOptIn, setSmsOptIn] = useState(initial?.sms_opt_in ?? true)
  const phoneNormalized = normalizePhoneNumber(phoneNumber)
  const phoneLooksValid = phoneNumber.trim().length === 0 || !!phoneNormalized
  const phoneIsValid = !!phoneNormalized

  // ─── Disclaimer ─────────────────────────────────────────────────────
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false)

  const toggle = <T,>(s: Set<T>, v: T, fn: (s: Set<T>) => void) => {
    const n = new Set(s)
    n.has(v) ? n.delete(v) : n.add(v)
    fn(n)
  }

  function submit() {
    if (!acceptedDisclaimer) {
      setError('You must accept the Health & Liability Acknowledgment to continue.')
      return
    }
    // SMS validation: if user opted in, they must have provided a valid phone.
    if (smsOptIn && !phoneNormalized) {
      setError('A valid mobile phone number is required to opt in to text messages. Or uncheck SMS to skip.')
      return
    }
    setError(null)
    start(async () => {
      const heightInches = heightFt * 12 + heightIn
      const res = await saveIntake({
        goals: [...goals],
        fitness_level: level || undefined,
        days_per_week: days,
        workout_minutes: minutes,
        equipment: [...equipment],
        target_areas: [...areas],
        training_style: style,
        coaching_tone: tone,
        delivery_time: time,
        injuries: injuries.trim() || undefined,
        // Tier 1
        age,
        sex: sex || undefined,
        height_inches: heightInches,
        weight_lbs: weight,
        medical_conditions: [...medical],
        medications: medications.trim() || undefined,
        pregnancy_status: sex === 'female' ? pregnancy : 'not-applicable',
        // Tier 2
        training_years: trainingYears,
        pr_bench_lbs: prBench ? parseFloat(prBench) : undefined,
        pr_squat_lbs: prSquat ? parseFloat(prSquat) : undefined,
        pr_deadlift_lbs: prDeadlift ? parseFloat(prDeadlift) : undefined,
        pr_mile_time: prMile.trim() || undefined,
        body_fat_pct: bodyFat ? parseFloat(bodyFat) : undefined,
        goal_target: goalTarget.trim() || undefined,
        goal_target_date: goalTargetDate || undefined,
        sleep_hours_avg: sleep,
        stress_level: stressLevel,
        occupation_activity: occupation,
        // Tier 3
        liked_exercises: liked.trim() || undefined,
        disliked_exercises: disliked.trim() || undefined,
        cardio_preference: [...cardio],
        mobility_issues: mobility.trim() || undefined,
        // Sports
        plays_sports: playsSports,
        sports: playsSports ? [...selectedSports] : [],
        sport_level: playsSports && sportLevel ? sportLevel : undefined,
        sport_season: playsSports && sportSeason ? sportSeason : undefined,
        sport_position: playsSports && sportPosition.trim() ? sportPosition.trim() : undefined,
        // SMS delivery (only set opt-in if phone is valid AND box was checked)
        phone_number: phoneNormalized || undefined,
        sms_opt_in: smsOptIn && !!phoneNormalized,
        sms_opt_in_version: smsOptIn && !!phoneNormalized ? SMS_OPT_IN_VERSION : undefined,
        // Disclaimer
        disclaimer_accepted: true,
        disclaimer_version: DISCLAIMER_VERSION,
      })
      if (!res.ok) {
        setError(res.error ?? 'Save failed.')
        return
      }
      router.push('/app/coach')
    })
  }

  const canAdvanceFromStep1 = !!sex && age >= 13 && age <= 100 && weight >= 60 && weight <= 700
  const canAdvanceFromStep3 = goals.size > 0 && !!level && equipment.size > 0
  const canSubmit =
    canAdvanceFromStep1 &&
    canAdvanceFromStep3 &&
    phoneIsValid &&             // phone required for delivery
    acceptedDisclaimer &&
    !pending

  return (
    <main className="min-h-dvh px-6 pt-6 pb-32 max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between">
        <Link
          href="/app/coach"
          aria-label="Back"
          className="h-9 w-9 rounded-full border border-[var(--color-border)] bg-white/[0.04] flex items-center justify-center text-white/85"
        >
          <BackIcon width={18} height={18} />
        </Link>
        <span className="text-[12px] font-bold uppercase tracking-wider text-white/50">
          Step {step} of {TOTAL_STEPS}
        </span>
        <span className="w-9" />
      </header>

      <div className="mt-3 flex gap-1.5">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? 'bg-[var(--color-primary)]' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-[var(--color-cyan)]/15 border border-[var(--color-cyan)]/30 flex items-center justify-center text-[var(--color-cyan)]">
          <BrainIcon width={22} height={22} />
        </div>
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight">
            {step === 1 && 'About you'}
            {step === 2 && 'Training history'}
            {step === 3 && 'Goals & equipment'}
            {step === 4 && 'Style & preferences'}
            {step === 5 && 'Daily delivery'}
            {step === 6 && DISCLAIMER_TITLE}
          </h1>
          <p className="text-[12px] text-[var(--color-text-muted)]">
            {step === 1 && 'Helps us train you safely.'}
            {step === 2 && 'Anchors load selection and recovery.'}
            {step === 3 && 'What you want, with what you have.'}
            {step === 4 && 'How you like to train.'}
            {step === 5 && 'Where to send your daily workout.'}
            {step === 6 && DISCLAIMER_INTRO}
          </p>
        </div>
      </div>

      {/* ─── STEP 1: About you (demographics & safety) ─── */}
      {step === 1 && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Age">
              <NumberInput value={age} onChange={setAge} min={13} max={100} />
            </Field>
            <Field label="Height">
              <div className="flex gap-1.5">
                <NumberInput value={heightFt} onChange={setHeightFt} min={3} max={8} suffix="ft" />
                <NumberInput value={heightIn} onChange={setHeightIn} min={0} max={11} suffix="in" />
              </div>
            </Field>
            <Field label="Weight (lbs)">
              <NumberInput value={weight} onChange={setWeight} min={60} max={700} step={1} />
            </Field>
          </div>

          <Field label="Sex">
            <Pills options={SEXES} selected={new Set(sex ? [sex] : [])} onClick={setSex} />
          </Field>

          {sex === 'female' && (
            <Field label="Pregnancy / postpartum">
              <Pills options={PREGNANCY} selected={new Set([pregnancy])} onClick={setPregnancy} />
            </Field>
          )}

          <Field label="Medical conditions">
            <Pills
              options={MEDICAL}
              selected={medical}
              onClick={v => toggle(medical, v, setMedical)}
            />
          </Field>

          <Field label="Medications (optional)">
            <textarea
              value={medications}
              onChange={e => setMedications(e.target.value.slice(0, 300))}
              rows={2}
              placeholder="e.g., beta-blocker, blood thinner"
              className={textareaCls}
            />
          </Field>

          <NavButtons
            canNext={canAdvanceFromStep1}
            onNext={() => setStep(2)}
            error={!canAdvanceFromStep1 ? 'Age, sex, height, and weight are required.' : undefined}
          />
        </div>
      )}

      {/* ─── STEP 2: Training history & current state ─── */}
      {step === 2 && (
        <div className="mt-6 space-y-6">
          <Field label="Years training">
            <SliderRow value={trainingYears} setValue={setTrainingYears} min={0} max={40} step={0.5} />
          </Field>

          <div>
            <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-text-muted)] mb-1">Current PRs (optional)</p>
            <p className="text-[12px] text-[var(--color-text-muted)] mb-2">
              Enter what you can lift today for 1 rep. Leave blank if unsure.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Bench (lbs)" value={prBench} onChange={setPrBench} placeholder="e.g., 185" type="number" />
              <TextField label="Squat (lbs)" value={prSquat} onChange={setPrSquat} placeholder="e.g., 245" type="number" />
              <TextField label="Deadlift (lbs)" value={prDeadlift} onChange={setPrDeadlift} placeholder="e.g., 315" type="number" />
              <TextField label="Mile time" value={prMile} onChange={setPrMile} placeholder="e.g., 8:30" />
            </div>
          </div>

          <Field label="Body fat % (optional)">
            <TextField label="" value={bodyFat} onChange={setBodyFat} placeholder="e.g., 18" type="number" />
          </Field>

          <Field label="Specific goal target (optional)">
            <textarea
              value={goalTarget}
              onChange={e => setGoalTarget(e.target.value.slice(0, 200))}
              rows={2}
              placeholder='e.g., "Lose 20 lbs by Aug 15" or "Bench 225 by year end"'
              className={textareaCls}
            />
          </Field>

          <Field label="Target date (optional)">
            <input
              type="date"
              value={goalTargetDate}
              onChange={e => setGoalTargetDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] p-3 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--color-primary)]"
            />
          </Field>

          <Field label="Average sleep / night (hours)">
            <SliderRow value={sleep} setValue={setSleep} min={3} max={12} step={0.5} suffix="h" />
          </Field>

          <Field label="Stress level">
            <Pills options={STRESS_LEVELS} selected={new Set([stressLevel])} onClick={setStressLevel} />
          </Field>

          <Field label="Occupation activity">
            <Pills options={OCCUPATION} selected={new Set([occupation])} onClick={setOccupation} />
          </Field>

          <NavButtons onBack={() => setStep(1)} canNext={true} onNext={() => setStep(3)} />
        </div>
      )}

      {/* ─── STEP 3: Goals & equipment (existing fields) ─── */}
      {step === 3 && (
        <div className="mt-6 space-y-6">
          <Field label="Goals">
            <Pills options={GOALS} selected={goals} onClick={v => toggle(goals, v, setGoals)} />
          </Field>

          <Field label="Fitness level">
            <Pills options={LEVELS} selected={new Set(level ? [level] : [])} onClick={setLevel} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Days / week">
              <SliderRow value={days} setValue={setDays} min={2} max={7} />
            </Field>
            <Field label="Minutes / session">
              <SliderRow value={minutes} setValue={setMinutes} min={20} max={120} step={5} suffix="m" />
            </Field>
          </div>

          <Field label="Equipment">
            <Pills options={EQUIPMENT} selected={equipment} onClick={v => toggle(equipment, v, setEquipment)} />
          </Field>

          <Field label="Target areas">
            <Pills options={AREAS} selected={areas} onClick={v => toggle(areas, v, setAreas)} />
          </Field>

          {/* ── Sports section ── */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-[13px] font-bold text-white">Do you play a sport?</p>
                <p className="text-[11px] text-white/50 mt-0.5">We'll build your workouts around your sport.</p>
              </div>
              <button
                type="button"
                onClick={() => setPlaysSports(v => !v)}
                className={`relative h-7 w-12 rounded-full transition-colors ${playsSports ? 'bg-[var(--color-primary)]' : 'bg-white/20'}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${playsSports ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </label>

            {playsSports && (
              <div className="space-y-4 pt-1 border-t border-white/10">
                <Field label="Sport(s)">
                  <Pills
                    options={COMMON_SPORTS}
                    selected={selectedSports}
                    onClick={v => toggle(selectedSports, v, setSelectedSports)}
                  />
                </Field>

                <Field label="Competition level">
                  <Pills
                    options={SPORT_LEVELS}
                    selected={new Set(sportLevel ? [sportLevel] : [])}
                    onClick={setSportLevel}
                  />
                </Field>

                <Field label="Current season">
                  <Pills
                    options={SPORT_SEASONS}
                    selected={new Set(sportSeason ? [sportSeason] : [])}
                    onClick={setSportSeason}
                  />
                </Field>

                <Field label="Position / role (optional)">
                  <input
                    type="text"
                    value={sportPosition}
                    onChange={e => setSportPosition(e.target.value.slice(0, 60))}
                    placeholder="e.g., Point guard, Wide receiver, Pitcher"
                    className={inputCls}
                  />
                </Field>
              </div>
            )}
          </div>

          <NavButtons
            onBack={() => setStep(2)}
            canNext={canAdvanceFromStep3}
            onNext={() => setStep(4)}
            error={!canAdvanceFromStep3 ? 'Pick at least one goal, your fitness level, and equipment.' : undefined}
          />
        </div>
      )}

      {/* ─── STEP 4: Style & preferences ─── */}
      {step === 4 && (
        <div className="mt-6 space-y-6">
          <Field label="Training style">
            <Pills options={[...STYLES] as string[]} selected={new Set([style])} onClick={v => setStyle(v as typeof STYLES[number])} />
          </Field>

          <Field label="Coaching tone">
            <Pills options={[...TONES] as string[]} selected={new Set([tone])} onClick={v => setTone(v as typeof TONES[number])} />
          </Field>

          <Field label="Cardio preference">
            <Pills options={CARDIO_PREFS} selected={cardio} onClick={v => toggle(cardio, v, setCardio)} />
          </Field>

          <Field label="Daily text time">
            <Pills options={TIMES} selected={new Set([time])} onClick={setTime} />
          </Field>

          <Field label="Injuries / limits">
            <textarea
              value={injuries}
              onChange={e => setInjuries(e.target.value.slice(0, 300))}
              rows={2}
              placeholder="e.g., bad left knee, no overhead pressing"
              className={textareaCls}
            />
          </Field>

          <Field label="Liked exercises (optional)">
            <textarea
              value={liked}
              onChange={e => setLiked(e.target.value.slice(0, 200))}
              rows={2}
              placeholder="e.g., deadlifts, swimming, yoga"
              className={textareaCls}
            />
          </Field>

          <Field label="Disliked exercises (optional)">
            <textarea
              value={disliked}
              onChange={e => setDisliked(e.target.value.slice(0, 200))}
              rows={2}
              placeholder="e.g., burpees, running outdoors"
              className={textareaCls}
            />
          </Field>

          <Field label="Mobility issues (optional)">
            <textarea
              value={mobility}
              onChange={e => setMobility(e.target.value.slice(0, 300))}
              rows={2}
              placeholder="e.g., tight hips, limited shoulder flexion"
              className={textareaCls}
            />
          </Field>

          <NavButtons onBack={() => setStep(3)} canNext={true} onNext={() => setStep(5)} />
        </div>
      )}

      {/* ─── STEP 5: Daily delivery — phone + SMS opt-in (REQUIRED) ─── */}
      {step === 5 && (
        <div className="mt-6 space-y-5">
          <div className="rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/[0.06] p-4">
            <p className="text-[14px] font-bold text-white">📱 Daily workout, delivered to your phone</p>
            <p className="mt-1.5 text-[12.5px] text-white/75 leading-relaxed">
              Your AI Coach plan is texted to you every morning at the time you picked. Add your
              mobile number below — we use it ONLY to send your workout and important account
              messages. No marketing, no spam, no third-party sharing.
            </p>
          </div>

          <Field label="Mobile phone number">
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="(214) 555-0123"
              inputMode="tel"
              autoComplete="tel"
              autoFocus
              className={inputCls + ' text-[16px]'}
            />
            {phoneNumber.trim().length > 0 && !phoneLooksValid && (
              <p className="mt-2 text-[12px] text-[var(--color-danger)]">
                Doesn't look like a valid phone number. Use 10 digits (US) or include country code.
              </p>
            )}
            {phoneNormalized && (
              <p className="mt-2 text-[12px] text-white/55">
                ✓ We'll text you at <span className="text-white font-semibold">{phoneNormalized}</span>
              </p>
            )}
            {!phoneNumber.trim() && (
              <p className="mt-2 text-[12px] text-white/55">
                US numbers: just 10 digits like 2145550123. International: include country code.
              </p>
            )}
          </Field>

          <label className={`flex items-start gap-3 rounded-2xl border p-4 transition cursor-pointer ${
            smsOptIn
              ? 'border-[var(--color-primary)]/50 bg-[var(--color-primary)]/[0.08]'
              : 'border-white/15 bg-white/[0.04] hover:bg-white/[0.06]'
          }`}>
            <input
              type="checkbox"
              checked={smsOptIn}
              onChange={e => setSmsOptIn(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[var(--color-primary)] cursor-pointer shrink-0"
            />
            <span className="text-[12.5px] text-white/90 leading-relaxed">
              <strong className="text-white">{SMS_OPT_IN_LABEL}</strong>
            </span>
          </label>

          {smsOptIn && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <p className="text-[10.5px] uppercase font-bold tracking-wider text-white/50 mb-1.5">
                Full TCPA disclosure
              </p>
              <p className="text-[11px] text-white/65 leading-relaxed">
                {SMS_OPT_IN_DISCLOSURE}
              </p>
            </div>
          )}

          {!smsOptIn && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/[0.06] p-3">
              <p className="text-[12px] text-yellow-200/90 leading-relaxed">
                ⚠️ You opted out of SMS. Your daily workout will only appear in the app —
                you'll need to open WorkoutPartna each morning to see it. Most users opt in.
              </p>
            </div>
          )}

          <NavButtons
            onBack={() => setStep(4)}
            canNext={phoneIsValid}
            onNext={() => setStep(6)}
            error={!phoneIsValid ? 'Phone number required so we can deliver your daily workout.' : undefined}
          />
        </div>
      )}

      {/* ─── STEP 6: Disclaimer & submit ─── */}
      {step === 6 && (
        <div className="mt-6 space-y-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-4">
            {DISCLAIMER_POINTS.map((p, i) => (
              <div key={i}>
                <p className="text-[13px] font-bold text-white">{p.heading}</p>
                <p className="mt-1 text-[12.5px] text-white/70 leading-relaxed">{p.body}</p>
              </div>
            ))}

            <div className="pt-3 border-t border-white/10">
              <p className="text-[12px] text-white/60">
                Read the full waiver:{' '}
                <Link href={FULL_WAIVER_PATH} target="_blank" className="text-[var(--color-primary)] underline">
                  workoutpartna.com/waiver
                </Link>
              </p>
              <p className="mt-1 text-[11px] text-white/40">
                Document version: {DISCLAIMER_VERSION}
              </p>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer rounded-2xl border border-white/15 bg-white/[0.04] p-4 hover:bg-white/[0.06] transition">
            <input
              type="checkbox"
              checked={acceptedDisclaimer}
              onChange={e => setAcceptedDisclaimer(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--color-primary)] cursor-pointer"
            />
            <span className="text-[13px] text-white/85 leading-relaxed">
              {DISCLAIMER_ACCEPT_LABEL}
            </span>
          </label>

          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="w-full h-12 rounded-full brand-gradient text-white font-bold text-[15px] disabled:opacity-50 transition"
          >
            {pending ? 'Saving...' : initial?.disclaimer_accepted ? 'Save changes' : 'Submit & start coaching'}
          </button>

          <button
            type="button"
            onClick={() => setStep(5)}
            disabled={pending}
            className="w-full h-11 rounded-full border border-white/15 bg-white/[0.04] text-white/85 text-[13px] font-bold hover:bg-white/[0.08] transition disabled:opacity-50"
          >
            Back
          </button>

          {error && <p className="text-[12px] text-[var(--color-danger)] text-center">{error}</p>}
        </div>
      )}
    </main>
  )
}

// ─── Reusable bits ──────────────────────────────────────────────────

const inputCls =
  'w-full rounded-xl border border-white/10 bg-[#1a1a1a] p-3 text-[14px] text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--color-primary)]'

const textareaCls = inputCls + ' resize-none'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      {label && (
        <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-text-muted)] mb-2">
          {label}
        </p>
      )}
      {children}
    </div>
  )
}

function TextField({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: 'text' | 'number'
}) {
  return (
    <div>
      {label && <p className="text-[11px] text-[var(--color-text-muted)] mb-1">{label}</p>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
      />
    </div>
  )
}

function NumberInput({
  value, onChange, min, max, step = 1, suffix = '',
}: {
  value: number
  onChange: (n: number) => void
  min: number
  max: number
  step?: number
  suffix?: string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1a1a1a] p-2 flex items-center justify-center gap-1">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e => onChange(Math.max(min, Math.min(max, parseFloat(e.target.value) || 0)))}
        className="w-full bg-transparent text-center text-[16px] font-bold text-white outline-none"
      />
      {suffix && <span className="text-[12px] text-white/50">{suffix}</span>}
    </div>
  )
}

function Pills({
  options, selected, onClick,
}: {
  options: string[]
  selected: Set<string>
  onClick: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const on = selected.has(o)
        return (
          <button
            key={o}
            type="button"
            onClick={() => onClick(o)}
            className={`px-3.5 py-2 rounded-full text-[13px] font-medium border transition capitalize ${
              on
                ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/15 text-[var(--color-brand-bright)]'
                : 'border-[var(--color-border)] bg-white/[0.03] text-white/85 hover:border-[var(--color-border-bright)]'
            }`}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

function SliderRow({
  value, setValue, min, max, step = 1, suffix = '',
}: {
  value: number
  setValue: (n: number) => void
  min: number
  max: number
  step?: number
  suffix?: string
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white/[0.04] p-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setValue(Math.max(min, value - step))}
          className="h-8 w-8 rounded-full bg-white/[0.06] text-white text-[18px] leading-none"
        >
          −
        </button>
        <span className="font-bold text-[18px]">
          {value}{suffix}
        </span>
        <button
          type="button"
          onClick={() => setValue(Math.min(max, value + step))}
          className="h-8 w-8 rounded-full bg-white/[0.06] text-white text-[18px] leading-none"
        >
          +
        </button>
      </div>
    </div>
  )
}

function NavButtons({
  onBack, onNext, canNext, error,
}: {
  onBack?: () => void
  onNext: () => void
  canNext: boolean
  error?: string
}) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="w-full h-12 rounded-full brand-gradient text-white font-bold text-[15px] disabled:opacity-50 transition"
      >
        Continue
      </button>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="w-full h-11 rounded-full border border-white/15 bg-white/[0.04] text-white/85 text-[13px] font-bold hover:bg-white/[0.08] transition"
        >
          Back
        </button>
      )}
      {error && (
        <p className="text-[12px] text-[var(--color-danger)] text-center">{error}</p>
      )}
    </div>
  )
}
