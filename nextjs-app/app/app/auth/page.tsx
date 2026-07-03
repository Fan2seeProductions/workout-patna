// /app/auth — unified sign in / sign up page (toggles between modes).
import type { Metadata } from 'next'
import { AuthClient } from './AuthClient'

export const metadata: Metadata = {
  title: 'Sign in or Sign up',
  robots: { index: false, follow: false },
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>
}) {
  const { mode } = await searchParams
  const initialMode = mode === 'signup' ? 'signup' : 'signin'
  return <AuthClient initialMode={initialMode} />
}
