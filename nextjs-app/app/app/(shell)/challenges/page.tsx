// /app/challenges — retired with the coach-only pivot (July 2026). Group
// challenges/leaderboards are descoped; see docs/MOMENTUM-AI-STRATEGY.md §4b.
// May return later as coach-issued (you-vs-your-streak) milestones instead.
import { redirect } from 'next/navigation'

export default function ChallengesPage() {
  redirect('/app/coach')
}
