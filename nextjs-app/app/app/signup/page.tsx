// /app/signup — forwards to the unified /app/auth page.
import { redirect } from 'next/navigation'

export default function SignupRedirect() {
  redirect('/app/auth?mode=signup')
}
