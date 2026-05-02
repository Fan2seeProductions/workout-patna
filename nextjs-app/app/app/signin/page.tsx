import { redirect } from 'next/navigation'
export default function SigninRedirect() {
  redirect('/app/auth?mode=signin')
}
