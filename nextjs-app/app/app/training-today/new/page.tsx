// /app/training-today/new — server component that loads gyms + user's gym,
// then renders the client form.
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { TrainingPostForm } from './TrainingPostForm'

export const metadata = { title: 'Post Training Today', robots: { index: false, follow: false } }

export default async function NewTrainingPostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const [{ data: me }, { data: gyms }] = await Promise.all([
    supabase.from('profiles').select('gym_id, primary_location').eq('id', user.id).maybeSingle(),
    supabase.from('gyms').select('id, name, type, city, state').order('name').limit(500),
  ])

  return (
    <TrainingPostForm
      gyms={(gyms ?? []) as { id: string; name: string; type: string; city: string }[]}
      defaultGymId={me?.gym_id ?? null}
    />
  )
}
