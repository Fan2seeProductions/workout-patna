// Pull subscription state for one user straight from Stripe and mirror it
// into ai_coach_subscriptions. This is the self-heal path: the webhook is
// the primary writer, but if a webhook was missed (or the endpoint was
// misconfigured when the member paid), the coach page calls this and the
// member still gets in. Stripe is the source of truth; the DB is a cache.
//
// Needs STRIPE_SECRET_KEY and SUPABASE_SERVICE_ROLE_KEY (writes bypass RLS
// the same way the webhook does). No-ops safely if either is missing.
import StripeSDK from 'stripe'
import { createServerClient } from '@supabase/ssr'

const LIVE_STATUSES = ['active', 'trialing', 'past_due']

type StripeSubLite = {
  id: string
  status: string
  customer: string | { id: string }
  current_period_end?: number
  created: number
}

/**
 * Returns true if a live (active/trialing/past_due) subscription was found
 * on Stripe and mirrored into the DB for this user.
 */
export async function syncSubscriptionFromStripe(userId: string): Promise<boolean> {
  const secret = process.env.STRIPE_SECRET_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret || !serviceRoleKey) return false

  try {
    const stripe = new StripeSDK(secret)
    const admin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      { cookies: { getAll: () => [], setAll: () => {} } },
    )

    // Find the Stripe customer: the DB row if we have one, else by the
    // supabase_user_id metadata stamped on the customer at checkout time.
    const { data: row } = await admin
      .from('ai_coach_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .maybeSingle()
    let customerId = (row?.stripe_customer_id as string | null) ?? null

    if (!customerId) {
      const found = await stripe.customers.search({
        query: `metadata['supabase_user_id']:'${userId}'`,
        limit: 1,
      })
      customerId = found.data[0]?.id ?? null
    }
    if (!customerId) return false

    const subs = (await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 10,
    })) as unknown as { data: StripeSubLite[] }
    if (!subs.data.length) return false

    // Prefer the newest live subscription; fall back to the newest overall
    // so a cancellation is mirrored too.
    const newestFirst = [...subs.data].sort((a, b) => b.created - a.created)
    const sub = newestFirst.find(s => LIVE_STATUSES.includes(s.status)) ?? newestFirst[0]

    const { error } = await admin.from('ai_coach_subscriptions').upsert(
      {
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: sub.id,
        status: sub.status,
        current_period_end: sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    if (error) {
      console.error('[stripe sync] upsert failed:', error.message)
      return false
    }
    return LIVE_STATUSES.includes(sub.status)
  } catch (err) {
    console.error('[stripe sync] failed:', (err as Error).message)
    return false
  }
}
