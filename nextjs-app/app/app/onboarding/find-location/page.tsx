// Retired with the coach-only pivot (July 2026). The gym/partner onboarding
// flow is descoped (docs/MOMENTUM-AI-STRATEGY.md §4b); new users go straight
// from auth to /app/coach, which handles intake. Redirect kept so old
// bookmarks/deep links don't 404.
import { redirect } from 'next/navigation'

export default function RetiredOnboardingStep() {
  redirect('/app/coach')
}
