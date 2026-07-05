// /app/coach/desk — Desk Break: instant micro-workouts for desk workers,
// standing desks, hotel rooms, and no-equipment days. Stateless — nothing
// saved; pick a context + duration and go.
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { DeskBreakClient } from './DeskBreakClient'

export const metadata = { title: 'Desk Break', robots: { index: false, follow: false } }

export default async function DeskBreakPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/auth')

  return <DeskBreakClient />
}
