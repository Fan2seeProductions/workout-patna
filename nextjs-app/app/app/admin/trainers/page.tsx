// /app/admin/trainers — retired with the coach-only pivot (July 2026).
// Trainer marketplace is descoped; see docs/MOMENTUM-AI-STRATEGY.md §4b.
import { redirect } from 'next/navigation'

export default function TrainerAdminPage() {
  redirect('/app/coach')
}
