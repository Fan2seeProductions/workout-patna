// /app/profile/[id] — retired with the coach-only pivot (July 2026). Partner
// profiles (compat scores/safety menu) are descoped; only the AI Coach bot is
// linked now. See docs/MOMENTUM-AI-STRATEGY.md §4b. Route kept as a redirect
// (not deleted) so old links/bookmarks don't 404.
import { redirect } from 'next/navigation'

export default function ProfileDetailPage() {
  redirect('/app/coach')
}
