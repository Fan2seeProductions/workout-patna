// Create a Stripe Checkout session for AI Daily Coach.
import { NextResponse } from 'next/server'
import StripeSDK from 'stripe'
import { createClient } from '../../../../lib/supabase/server'

export async function POST() {
  const secret = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_AI_COACH_PRICE_ID
  if (!secret || !priceId) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Add STRIPE_SECRET_KEY and STRIPE_AI_COACH_PRICE_ID.' },
      { status: 500 },
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })

  const stripe = new StripeSDK(secret)

  // Reuse customer if we have one
  const { data: existing } = await supabase
    .from('ai_coach_subscriptions')
    .select('stripe_customer_id, status')
    .eq('user_id', user.id)
    .maybeSingle()

  // Grant the 14-day trial ONLY to first-timers. Anyone who already had a
  // trialing/active/past_due/canceled subscription (including grandfathered
  // no-card trialers whose period ended) goes straight to paid — no second
  // free trial. A bare row carrying only a stripe_customer_id (status null,
  // from an abandoned earlier checkout) still counts as a first-timer.
  const priorStatus = existing?.status as string | null | undefined
  const hadRealSubscription =
    priorStatus === 'trialing' ||
    priorStatus === 'active' ||
    priorStatus === 'past_due' ||
    priorStatus === 'canceled'
  const trialDays = hadRealSubscription ? undefined : 14

  let customerId = existing?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
    // RLS on ai_coach_subscriptions is select-only for users, so this write
    // needs the service-role client. If the key isn't set we skip it — the
    // customer is still findable later via its supabase_user_id metadata
    // (see lib/stripe/sync.ts).
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (serviceRoleKey) {
      const { createServerClient } = await import('@supabase/ssr')
      const admin = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        { cookies: { getAll: () => [], setAll: () => {} } },
      )
      await admin
        .from('ai_coach_subscriptions')
        .upsert({ user_id: user.id, stripe_customer_id: customerId }, { onConflict: 'user_id' })
    }
  }

  // Build the return URL from the domain the member is ACTUALLY on. Supabase
  // auth cookies are host-only (not shared across apex ↔ www ↔ *.vercel.app),
  // so a return URL on a different host drops the session and bounces the user
  // to sign-in after paying. Prefer Origin; fall back to Host; never a
  // hardcoded foreign domain.
  const h = await (await import('next/headers')).headers()
  const hostHeader = h.get('host')
  const origin =
    h.get('origin') ||
    (hostHeader ? `https://${hostHeader}` : 'https://workoutpartna.com')

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      metadata: { supabase_user_id: user.id },
      // Only first-timers get the 14-day trial; trialDays is undefined for
      // anyone who already had a subscription (no second free trial).
      ...(trialDays ? { trial_period_days: trialDays } : {}),
    },
    success_url: `${origin}/app/coach?status=success`,
    cancel_url:  `${origin}/app/coach?status=cancel`,
    allow_promotion_codes: true,
    metadata: { supabase_user_id: user.id },
  })

  return NextResponse.json({ url: session.url })
}
