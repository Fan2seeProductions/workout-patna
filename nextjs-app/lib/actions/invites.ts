// Server actions for invite tracking. 3 invites removes the watermark,
// 5 invites grants 7 days of premium.
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'

export async function incrementInviteCount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Sign in required.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('invite_count, premium_until')
    .eq('id', user.id)
    .maybeSingle()

  const next = (profile?.invite_count ?? 0) + 1
  const grantPremium = next === 5
  const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const { error } = await supabase
    .from('profiles')
    .update({
      invite_count: next,
      ...(grantPremium ? { is_premium: true, premium_until: oneWeekFromNow } : {}),
    })
    .eq('id', user.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/app/home')
  return {
    ok: true,
    inviteCount: next,
    premiumGranted: grantPremium,
    message: grantPremium
      ? '🎉 You unlocked 1 week of free Premium!'
      : `Invite logged. ${Math.max(0, 5 - next)} more to unlock free Premium.`,
  }
}
