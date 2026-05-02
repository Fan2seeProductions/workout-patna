// /app/gyms — Communities. Mirrors the Replit Gyms page.
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { GymsClient, type Location } from './GymsClient'

export const metadata = { title: 'Communities', robots: { index: false, follow: false } }

export default async function GymsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/auth')

  const { data: gyms } = await supabase
    .from('gyms')
    .select('id, name, type, address, city, state, members, image')
    .order('members', { ascending: false })
    .limit(100)

  return <GymsClient locations={(gyms ?? []) as Location[]} />
}
