// 4-step onboarding flow. Mirrors the Replit Onboarding page.
import { redirect } from 'next/navigation'
import { createClient } from '../../../lib/supabase/server'
import { OnboardingClient, type GymOption } from './OnboardingClient'

export const metadata = {
  title: 'Get started',
  robots: { index: false, follow: false },
}

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const { data: gyms } = await supabase
    .from('gyms')
    .select('id, name, type, city, state, members')
    .order('name', { ascending: true })
    .limit(200)

  return <OnboardingClient initialGyms={(gyms ?? []) as GymOption[]} />
}
