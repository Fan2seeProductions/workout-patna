// /app/auth — unified sign in / sign up page (toggles between modes).
// Mirrors the Replit Auth split-screen layout. When ?role=trainer is
// passed, sends new accounts to /app/trainers/apply after confirmation.
import type { Metadata } from 'next'
import { AuthClient } from './AuthClient'

export const metadata: Metadata = {
  title: 'Sign in or Sign up',
  robots: { index: false, follow: false },
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; role?: string }>
}) {
  const { mode, role } = await searchParams
  const initialMode = mode === 'signup' ? 'signup' : 'signin'
  const trainerSignup = role === 'trainer'
  return <AuthClient initialMode={initialMode} trainerSignup={trainerSignup} />
}
