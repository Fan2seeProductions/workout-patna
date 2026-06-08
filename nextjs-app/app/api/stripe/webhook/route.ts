// Stripe webhook. Mirrors subscription state to ai_coach_subscriptions.
// Stripe SDK namespace types aren't reliably exported in v22, so we use
// minimal local types for the shapes we read.
import { NextResponse, type NextRequest } from 'next/server'
import StripeSDK from 'stripe'
import { createServerClient } from '@supabase/ssr'

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
  subscription?: string | null
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
      case 'checkout.session.completed': {
        const session = event.data.object as StripeCheckoutSession
        if (session.subscription) {
          const sub = (await stripe.subscriptions.retrieve(session.subscription)) as unknown as StripeSub
          await upsertFromSub(sub)
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
