// /app/matches — retired with the coach-only pivot (July 2026). User-to-user
// matching is descoped; see docs/MOMENTUM-AI-STRATEGY.md §4b.
//
// NOTE: /app/messages/[id] is intentionally left untouched — the
// bot_save_and_send_workout RPC (api/cron/daily-workouts) may post coach
// deliveries into the same messages/thread mechanism, and that couldn't be
// confirmed one way or the other while the Supabase project is paused.
// Don't retire /app/messages until that's verified against the live schema.
import { redirect } from 'next/navigation'

export default function MatchesPage() {
  redirect('/app/coach')
}
