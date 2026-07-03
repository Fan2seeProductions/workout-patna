// /app/discover — retired with the coach-only pivot (July 2026). Partner
// discovery/matching is descoped; see docs/MOMENTUM-AI-STRATEGY.md §4b.
// BrowseShell/SwipeDeck/matching.ts are left on disk (unreachable) so the
// feature can come back cheaply if retention data argues for it.
import { redirect } from 'next/navigation'

export default function DiscoverPage() {
  redirect('/app/coach')
}
