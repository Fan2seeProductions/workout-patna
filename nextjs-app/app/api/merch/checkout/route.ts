// Create a Stripe Checkout session for a single merch item (Printful variant).
// Price is resolved server-side from Printful — the client only sends the
// variant id, never a price. After payment, the Stripe webhook creates a
// draft order in Printful (see /api/stripe/webhook).

import { NextResponse, type NextRequest } from 'next/server'
import StripeSDK from 'stripe'
import { headers } from 'next/headers'
import { createClient } from '../../../../lib/supabase/server'
import { getVariant, printfulConfigured } from '../../../../lib/printful/client'

export const runtime = 'nodejs'

// Flat US shipping until real-time Printful rates are wired up.
const SHIPPING_CENTS = Number(process.env.MERCH_SHIPPING_CENTS ?? 499)

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 })
  }
  if (!printfulConfigured()) {
    return NextResponse.json({ error: 'Merch store is not configured (missing PRINTFUL_API_KEY).' }, { status: 500 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 })

  const body = await req.json().catch(() => null) as { variantId?: number } | null
  const variantId = Number(body?.variantId)
  if (!Number.isInteger(variantId) || variantId <= 0) {
    return NextResponse.json({ error: 'Invalid variant.' }, { status: 400 })
  }

  // Server-side price lookup — never trust a client-sent price.
  const variant = await getVariant(variantId)
  if (!variant || variant.priceCents <= 0) {
    return NextResponse.json({ error: 'This item is unavailable right now.' }, { status: 404 })
  }

  const stripe = new StripeSDK(secret)
  const origin = (await headers()).get('origin') || 'https://workout-patna.vercel.app'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: variant.priceCents,
        product_data: {
          name: variant.name,
          ...(variant.image ? { images: [variant.image] } : {}),
        },
      },
    }],
    shipping_address_collection: { allowed_countries: ['US'] },
    shipping_options: [{
      shipping_rate_data: {
        display_name: 'Standard shipping',
        type: 'fixed_amount',
        fixed_amount: { amount: SHIPPING_CENTS, currency: 'usd' },
      },
    }],
    customer_email: user.email,
    metadata: {
      merch: 'true',
      printful_sync_variant_id: String(variantId),
      supabase_user_id: user.id,
    },
    success_url: `${origin}/app/merch?status=success`,
    cancel_url:  `${origin}/app/merch?status=cancel`,
  })

  return NextResponse.json({ url: session.url })
}
