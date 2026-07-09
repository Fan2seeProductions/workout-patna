// /app/reset — set a new password. The user arrives here from the recovery
// email link after /auth/callback has exchanged the code for a session, so a
// valid session is required to change the password.
import type { Metadata } from 'next'
import { ResetForm } from './ResetForm'

export const metadata: Metadata = {
  title: 'Set a new password',
  robots: { index: false, follow: false },
}

export default function ResetPasswordPage() {
  return <ResetForm />
}
