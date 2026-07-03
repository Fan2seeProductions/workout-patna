// Retired onboarding step — coach intake now lives at /app/coach/intake.
import { redirect } from 'next/navigation'

export default function RetiredCoachIntakeStep() {
  redirect('/app/coach/intake')
}
