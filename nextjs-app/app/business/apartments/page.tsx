// /business/apartments — legacy URL, now redirects to the unified B2B page
// at /for-gyms-apartments. The old ClaimForm component is preserved on disk
// in case we want to re-mount it as a separate flow later.
import { redirect } from 'next/navigation'

export default function ApartmentsRedirect() {
  redirect('/for-gyms-apartments')
}
