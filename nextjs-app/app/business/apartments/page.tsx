// /business/apartments — retired with the coach-only pivot (July 2026),
// same as /for-gyms-apartments; see docs/MOMENTUM-AI-STRATEGY.md §4b. The old
// ClaimForm component is preserved on disk in case B2B ever comes back.
import { redirect } from 'next/navigation'

export default function ApartmentsRedirect() {
  redirect('/')
}
