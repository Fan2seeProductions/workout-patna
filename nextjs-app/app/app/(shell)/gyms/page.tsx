// /app/gyms — retired with the coach-only pivot (July 2026). Gym directory
// is descoped; see docs/MOMENTUM-AI-STRATEGY.md §4b.
import { redirect } from 'next/navigation'

export default function GymsPage() {
  redirect('/app/coach')
}
