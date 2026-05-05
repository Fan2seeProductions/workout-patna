// Server action to create a Stripe Checkout session for partner location pricing.
'use server'

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY

const PRICE_MAP: Record<string, { name: string; amount: number }> = {
  starter: { name: 'Starter Location', amount: 9900 },
  growth: { name: 'Growth Location', amount: 19900 },
}

export async function createPartnerCheckout(tier: string, leadEmail?: string) {
  if (!STRIPE_SECRET) {
    return { ok: false, error: 'Stripe is not configured yet. Please contact sales@fan2seeproductions.com.' }
  }

  const plan = PRICE_MAP[tier]
  if (!plan) return { ok: false, error: 'Unknown plan.' }

  try {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][product_data][name]': `WorkoutPartna ${plan.name}`,
        'line_items[0][price_data][unit_amount]': plan.amount.toString(),
        'line_items[0][price_data][recurring][interval]': 'month',
        'line_items[0][quantity]': '1',
        ...(leadEmail ? { 'customer_email': leadEmail } : {}),
        'success_url': `${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'https://workoutpartna.com' : 'http://localhost:3000'}/for-gyms-apartments?checkout=success`,
        'cancel_url': `${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'https://workoutpartna.com' : 'http://localhost:3000'}/for-gyms-apartments#partner`,
      }),
    })

    const session = await res.json()
    if (session.error) return { ok: false, error: session.error.message }
    return { ok: true, url: session.url }
  } catch {
    return { ok: false, error: 'Could not create checkout session.' }
  }
}
