// /for-gyms-apartments — retired with the coach-only pivot (July 2026). B2B
// gym/apartment sales page is descoped; see docs/MOMENTUM-AI-STRATEGY.md §4b.
// 301-style redirect (not a 404) so any existing inbound links/SEO carry over.
import { redirect } from 'next/navigation'

export default function ForGymsApartmentsPage() {
  redirect('/')
}
