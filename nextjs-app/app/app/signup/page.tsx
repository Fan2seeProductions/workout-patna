import { redirect } from 'next/navigation'
export default function SignupRedirect() {
  redirect('/app/auth?mode=signup')
}
