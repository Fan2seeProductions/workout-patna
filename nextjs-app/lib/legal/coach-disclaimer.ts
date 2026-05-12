// AI Coach health & liability disclaimer.
// Versioned so we have a clear legal record of what each user accepted.
// Update DISCLAIMER_VERSION whenever the text materially changes.

export const DISCLAIMER_VERSION = '2026-05-08-v1'

export const DISCLAIMER_TITLE = 'Health & Liability Acknowledgment'

export const DISCLAIMER_INTRO =
  'Before submitting your AI Coach intake, please read and accept this acknowledgment.'

/** Short, scannable bullets shown directly in the form. */
export const DISCLAIMER_POINTS: { heading: string; body: string }[] = [
  {
    heading: 'Not medical advice',
    body:
      'WorkoutPartna and its coaches are not licensed medical professionals. The workouts, programming, ' +
      'recommendations, and any guidance you receive through this app are for general fitness and ' +
      'educational purposes only. They are NOT medical advice and are NOT a substitute for consultation ' +
      'with a physician, physical therapist, or other qualified healthcare professional.',
  },
  {
    heading: 'You assume the risk',
    body:
      'You voluntarily choose to participate in physical exercise programming and acknowledge that ' +
      'exercise carries inherent risks including injury, illness, cardiac events, and in rare cases ' +
      'death. You are responsible for performing exercises with proper form and within your physical ' +
      'capability. Stop any activity that causes pain, dizziness, shortness of breath, chest pain, or ' +
      'other concerning symptoms, and seek immediate medical attention if needed.',
  },
  {
    heading: 'Consult a doctor first',
    body:
      'You confirm that you are physically capable of performing the activities described, and that you ' +
      'have either consulted a qualified healthcare provider before starting this program OR you accept ' +
      'sole responsibility for not doing so. If you are pregnant, post-partum, recovering from injury, ' +
      'managing a chronic condition, or taking medications that affect heart rate, blood pressure, or ' +
      'recovery, you must clear participation with your physician.',
  },
  {
    heading: 'Truthful information',
    body:
      'You agree to provide truthful, accurate information about your medical history, current medications, ' +
      'injuries, pregnancy status, and physical condition. Inaccurate or incomplete disclosure releases ' +
      'WorkoutPartna and its affiliates from liability for any harm that results.',
  },
  {
    heading: 'Release of liability',
    body:
      'You release WorkoutPartna, Fan2See Productions LLC, and all affiliated coaches, employees, ' +
      'contractors, and agents from any and all claims, demands, damages, actions, or causes of action ' +
      'arising from your participation in any program, exercise, or recommendation provided through this ' +
      'service, except where prohibited by law. This release applies to you, your heirs, executors, and ' +
      'assigns, and is intended to be a binding waiver of liability under the laws of the State of Texas.',
  },
  {
    heading: 'Your medical responsibility',
    body:
      'You are solely responsible for your own health insurance and any medical care you may require. ' +
      'WorkoutPartna does not provide health insurance and does not cover medical costs.',
  },
]

/** Inline summary the user clicks "I accept" on. */
export const DISCLAIMER_ACCEPT_LABEL =
  'I have read and agree to the Health & Liability Acknowledgment above. I accept full responsibility ' +
  'for my participation in this fitness program and release WorkoutPartna and Fan2See Productions LLC ' +
  'from liability as described.'

/** Where the full waiver lives — referenced from the form. */
export const FULL_WAIVER_PATH = '/waiver'
