// AI Coach intake form.
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { IntakeForm } from './IntakeForm'

export const metadata = { title: 'AI Coach intake', robots: { index: false, follow: false } }

export default async function IntakePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const { data: existing } = await supabase
    .from('ai_coach_intake')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return <IntakeForm initial={existing ?? null} />
}
