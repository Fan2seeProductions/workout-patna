// Account deletion — required by Apple App Store Guideline 5.1.1(v) (any app
// with account creation must offer in-app account deletion) and promised by
// our own privacy policy ("you may delete your account through the app
// settings").
//
// Order matters:
//   1. Cancel any live Stripe subscription (so the member isn't billed again).
//      Read stripe ids BEFORE deleting data — the row cascades away in step 2.
//   2. Delete public.profiles — every data table (intake, subscriptions,
//      workouts, matches, messages, push, notifications) cascades from it.
//   3. Delete the auth.users record via the service-role admin API
//      (profiles has no FK to auth.users, so this must be explicit).
//   4. Sign out this browser's session cookies.
'use server'

import { redirect } from 'next/navigation'
import StripeSDK from 'stripe'
import { createClient } from '../supabase/server'
import { createAdminClient } from '../supabase/admin'

export async function deleteAccount(): Promise<{ ok: false; error: string } | never> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in.' }

  const admin = createAdminClient()
  if (!admin) {
    console.error('[account] SUPABASE_SERVICE_ROLE_KEY not set — cannot delete account.')
    return { ok: false, error: 'Account deletion is temporarily unavailable. Contact sales@fan2seeproductions.com and we will delete your account manually.' }
  }

  // 1. Cancel Stripe subscription so no further charges occur.
  try {
    const { data: sub } = await admin
      .from('ai_coach_subscriptions')
      .select('stripe_subscription_id, status')
      .eq('user_id', user.id)
      .maybeSingle()

    const stripeSecret = process.env.STRIPE_SECRET_KEY
    if (stripeSecret && sub?.stripe_subscription_id) {
      const stripe = new StripeSDK(stripeSecret)
      try {
        await stripe.subscriptions.cancel(sub.stripe_subscription_id as string)
      } catch (err) {
        // Already-canceled subscriptions throw — that's fine, keep deleting.
        console.warn('[account] Stripe cancel (non-fatal):', (err as Error).message)
      }
    }
  } catch (err) {
    console.warn('[account] subscription lookup (non-fatal):', (err as Error).message)
  }

  // 2. Delete the profile row — cascades to all member data tables.
  const { error: profileErr } = await admin.from('profiles').delete().eq('id', user.id)
  if (profileErr) {
    console.error('[account] profile delete failed:', profileErr.message)
    return { ok: false, error: 'Could not delete your data. Please try again or contact support.' }
  }

  // 3. Delete the auth record itself.
  const { error: authErr } = await admin.auth.admin.deleteUser(user.id)
  if (authErr) {
    // Data is already gone; the orphaned auth record can't access anything,
    // but surface it in logs for manual cleanup.
    console.error('[account] auth user delete failed (data already wiped):', authErr.message)
  }

  // 4. Clear this browser's session and land on the homepage.
  await supabase.auth.signOut()
  redirect('/?account=deleted')
}
