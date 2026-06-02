// /app/home — Coach-first pivot.
//
// The old social-style dashboard (matches preview, communities, etc.) is
// archived alongside as HomeDashboardArchived.tsx.archive. We're keeping
// the code in case the social side is reactivated later, but the route
// now sends users straight to the AI Coach.
//
// /app/coach handles its own gating:
//   - not subscribed   → trial paywall
//   - trialing/active  → today's workout (creates intake row if missing)
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Home',
  robots: { index: false, follow: false },
}

export default function HomePage() {
  redirect('/app/coach')
}
