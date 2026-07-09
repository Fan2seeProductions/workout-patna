// /app/forgot — request a password-reset email. Sends a Supabase recovery
// link that routes through /auth/callback (code exchange) to /app/reset.
import type { Metadata } from 'next'
import { ForgotForm } from './ForgotForm'

export const metadata: Metadata = {
  title: 'Reset your password',
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return <ForgotForm />
}
