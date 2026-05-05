// /app/trainers/apply — trainer self-signup form.
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { TrainerApplyForm } from './TrainerApplyForm'

export const metadata = { title: 'Apply as Trainer', robots: { index: false, follow: false } }

export default async function TrainerApplyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signup?role=trainer')

  const [{ data: existing }, { data: gyms }, { data: profile }] = await Promise.all([
    supabase.from('trainer_applications').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('gyms').select('id, name, city, state').order('name').limit(500),
    supabase.from('profiles').select('display_name, photo_url').eq('id', user.id).maybeSingle(),
  ])

  return (
    <TrainerApplyForm
      existing={existing}
      gyms={(gyms ?? []) as { id: string; name: string; city: string; state: string }[]}
      defaultName={existing?.name || profile?.display_name || ''}
      defaultPhoto={existing?.photo_url || profile?.photo_url || null}
    />
  )
}
