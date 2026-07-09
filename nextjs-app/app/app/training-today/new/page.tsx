// /app/training-today/new — retired with the coach-only pivot (July 2026).
// Training Today posts are descoped; see docs/MOMENTUM-AI-STRATEGY.md §4b. Route
// kept as a redirect (not deleted) so old links/bookmarks don't 404.
import { redirect } from 'next/navigation'

export default function NewTrainingPostPage() {
  redirect('/app/coach')
}
