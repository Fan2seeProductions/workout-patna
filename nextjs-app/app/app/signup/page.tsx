// /app/signup — preserves the optional ?role=trainer query and forwards
// to the unified /app/auth page.
import { redirect } from 'next/navigation'

export default async function SignupRedirect({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const { role } = await searchParams
  const role_q = role === 'trainer' ? '&role=trainer' : ''
  redirect(`/app/auth?mode=signup${role_q}`)
}
