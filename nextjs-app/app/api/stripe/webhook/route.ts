// Stripe webhook. Mirrors subscription state to ai_coach_subscriptions.
// Stripe SDK namespace types aren't reliably exported in v22, so we use
// minimal local types for the shapes we read.
import { NextResponse, type NextRequest } from 'next/server'
import StripeSDK from 'stripe'
import { createServerClient } from '@supabase/ssr'
import { createDraftOrder } from '../../../../lib/printful/client'

// A paid merch checkout becomes a DRAFT Printful order — reviewed and
// confirmed manually in the Printful dashboard before anything ships.
// external_id = the Stripe session id, so webhook retries can't duplicate it.
// Throws on failure so Stripe retries (payment collected but unfulfilled is
// the one state we must surface loudly).
async function createPrintfulDraftOrder(session: StripeCheckoutSession) {
  const variantId = Number(session.metadata?.printful_sync_variant_id)
  if (!Number.isInteger(variantId) || variantId <= 0) {
    throw new Error(`merch session ${session.id} has no printful_sync_variant_id`)
  }

  const shipping = session.shipping_details ?? session.collected_information?.shipping_details
  const addr = shipping?.address
  if (!addr?.line1 || !addr.city || !addr.postal_code || !addr.country) {
    throw new Error(`merch session ${session.id} is missing a shipping address`)
  }

  const result = await createDraftOrder({
    externalId: session.id,
    syncVariantId: variantId,
    recipient: {
      name: shipping?.name ?? session.customer_details?.name ?? 'Customer',
      address1: addr.line1,
      address2: addr.line2 ?? null,
      city: addr.city,
      state_code: addr.state ?? null,
      country_code: addr.country,
      zip: addr.postal_code,
      email: session.customer_details?.email ?? null,
    },
  })

  if (!result.ok) {
    throw new Error(`Printful draft order failed for session ${session.id}: ${result.error}`)
  }
  console.log(`[stripe webhook] Printful draft order created (session ${session.id}, order ${result.orderId})`)
}

export const runtime = 'nodejs'

type StripeSub = {
  id: string
  status: string
  customer: string | { id: string }
  current_period_end?: number
  metadata?: Record<string, string>
}

type StripeEvent = {
  type: string
  data: { object: unknown }
}

type StripeCheckoutSession = {
  id: string
  subscription?: string | null
  metadata?: Record<string, string>
  customer_details?: { email?: string | null; name?: string | null } | null
  // Stripe has moved shipping info between fields across API versions; we
  // read both spellings.
  shipping_details?: StripeShipping | null
  collected_information?: { shipping_details?: StripeShipping | null } | null
}

type StripeShipping = {
  name?: string | null
  address?: {
    line1?: string | null
    line2?: string | null
    city?: string | null
    state?: string | null
    postal_code?: string | null
    country?: string | null
  } | null
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret || !whSecret) {
    return NextResponse.json({ error: 'Stripe webhook not configured.' }, { status: 500 })
  }

  const stripe = new StripeSDK(secret)
  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'Missing signature.' }, { status: 400 })

  const raw = await req.text()
  let event: StripeEvent
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret) as unknown as StripeEvent
  } catch (err) {
    return NextResponse.json({ error: `Bad signature: ${(err as Error).message}` }, { status: 400 })
  }

  // The webhook is server-to-server (authenticated by the Stripe signature
  // we just verified, not a user session). Writing subscription state past
  // RLS REQUIRES the service-role key. We deliberately do NOT fall back to
  // the anon key — that silently fails RLS and drops the write, which is the
  // bug this used to have. If the key is missing we 500 so the failure is
  // visible and Stripe retries the event until it's configured.
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    console.error('[stripe webhook] SUPABASE_SERVICE_ROLE_KEY is not set — cannot persist subscription state.')
    return NextResponse.json(
      { error: 'Subscription store not configured (missing service role key).' },
      { status: 500 },
    )
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { cookies: { getAll: () => [], setAll: () => {} } },
  )

  async function upsertFromSub(sub: StripeSub) {
    const userId = (sub.metadata?.supabase_user_id ?? null) as string | null
    if (!userId) {
      console.warn('[stripe webhook] subscription has no supabase_user_id metadata; skipping.', sub.id)
      return
    }
    const { error } = await supabase
      .from('ai_coach_subscriptions')
      .upsert(
        {
          user_id: userId,
          stripe_customer_id: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
          stripe_subscription_id: sub.id,
          status: sub.status,
          current_period_end: sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      )
    // Throw so the handler 500s and Stripe retries rather than silently
    // dropping a subscription update.
    if (error) throw new Error(`ai_coach_subscriptions upsert failed: ${error.message}`)
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await upsertFromSub(event.data.object as StripeSub)
        break
      case 'invoice.payment_failed': {
        // Mirror the post-failure subscription state (past_due/unpaid) so
        // access checks see it — otherwise a bounced card stays "active".
        const invoice = event.data.object as { subscription?: string | null }
        if (invoice.subscription) {
          const sub = (await stripe.subscriptions.retrieve(invoice.subscription)) as unknown as StripeSub
          await upsertFromSub(sub)
        }
        break
      }
      case 'checkout.session.completed': {
        const session = event.data.object as StripeCheckoutSession
        if (session.subscription) {
          const sub = (await stripe.subscriptions.retrieve(session.subscription)) as unknown as StripeSub
          await upsertFromSub(sub)
        } else if (session.metadata?.merch === 'true') {
          await createPrintfulDraftOrder(session)
        }
        break
      }
      default:
        break
    }
  } catch (err) {
    // Surface the failure so Stripe retries (idempotent upsert keyed on user_id).
    console.error('[stripe webhook] handler error:', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
