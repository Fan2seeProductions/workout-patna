// /app/locations/[id] — retired with the coach-only pivot (July 2026). Gym
// community hubs are descoped; see docs/MOMENTUM-AI-STRATEGY.md §4b.
import { redirect } from 'next/navigation'

export default function LocationHubPage() {
  redirect('/app/coach')
}
