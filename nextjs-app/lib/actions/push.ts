// Server actions for managing web push subscriptions.
'use server'

import { createClient } from '../supabase/server'

export async function subscribePush(subscription: {
  endpoint: string
  keys: { p256dh: string; auth: string }
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      {
        user_id:  user.id,
        endpoint: subscription.endpoint,
        p256dh:   subscription.keys.p256dh,
        auth:     subscription.keys.auth,
      },
      { onConflict: 'user_id,endpoint' },
    )

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function unsubscribePush(endpoint: string): Promise<{ ok: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false }

  await supabase
    .from('push_subscriptions')
    .delete()
    .eq('user_id', user.id)
    .eq('endpoint', endpoint)

  return { ok: true }
}

/** Check if the current user has any active push subscription. */
export async function getPushStatus(): Promise<{ subscribed: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { subscribed: false }

  const { count } = await supabase
    .from('push_subscriptions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return { subscribed: (count ?? 0) > 0 }
}
