// /app/admin/location — retired with the coach-only pivot (July 2026). Gym
// location admin tooling is descoped; see docs/MOMENTUM-AI-STRATEGY.md §4b.
import { redirect } from 'next/navigation'

export default function LocationAdminPage() {
  redirect('/app/coach')
}
