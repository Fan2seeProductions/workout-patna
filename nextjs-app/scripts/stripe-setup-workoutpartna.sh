#!/usr/bin/env bash
# Provision the WorkoutPartna Stripe account from scratch:
#   1. AI Daily Coach product
#   2. $9.99/mo recurring price
#   3. 100%-off coupon
#   4. PARTNA14 promotion code
#   5. Webhook endpoint pointing at https://workoutpartna.com/api/stripe/webhook
#
# REQUIRES: STRIPE_KEY env var set to the WorkoutPartna sk_live_… secret key.
#   export STRIPE_KEY="sk_live_…"
#
# Run from anywhere:
#   bash scripts/stripe-setup-workoutpartna.sh
#
# Idempotent? NO. Each run creates new objects. Run once, paste the output,
# and don't re-run unless you intend to create duplicates.

set -euo pipefail

if [[ -z "${STRIPE_KEY:-}" ]]; then
  echo "❌ STRIPE_KEY is not set. Export it first:"
  echo "   export STRIPE_KEY=\"sk_live_…\""
  echo ""
  echo "Get the key from the WorkoutPartna account at:"
  echo "   https://dashboard.stripe.com/apikeys"
  echo "(Make sure the account picker top-left shows 'WorkoutPartna' before copying.)"
  exit 1
fi

if [[ "$STRIPE_KEY" != sk_live_* ]]; then
  echo "❌ Refusing to run — STRIPE_KEY does not look like a live secret key."
  echo "   Expected prefix: sk_live_"
  echo "   Got prefix:      ${STRIPE_KEY:0:8}…"
  exit 1
fi

API="https://api.stripe.com/v1"
AUTH=(-u "${STRIPE_KEY}:")

# Helper: POST form data, return the response body, fail loudly on error
stripe_post() {
  local path="$1"
  shift
  local resp
  resp=$(curl -sS "${AUTH[@]}" "${API}${path}" "$@")
  if echo "$resp" | grep -q '"error"'; then
    echo "❌ Stripe API error from POST ${path}:"
    echo "$resp"
    exit 1
  fi
  echo "$resp"
}

# Tiny JSON-id extractor (avoids requiring jq)
extract_id() {
  echo "$1" | python3 -c 'import sys, json; print(json.load(sys.stdin)["id"])'
}
extract_field() {
  echo "$1" | python3 -c "import sys, json; print(json.load(sys.stdin)[\"$2\"])"
}

echo "🏋️  Provisioning WorkoutPartna Stripe account..."
echo ""

# ─── 1. Product ─────────────────────────────────────────────────────────────
echo "1/5  Creating product: WorkoutPartna AI Daily Coach"
PRODUCT_JSON=$(stripe_post "/products" \
  -d "name=WorkoutPartna AI Daily Coach" \
  -d "description=Personalized AI-generated daily workouts, adapted to your goals, schedule, equipment, and yesterday's feedback." \
  -d "metadata[app]=workoutpartna" \
  -d "metadata[feature]=ai_daily_coach")
PRODUCT_ID=$(extract_id "$PRODUCT_JSON")
echo "     ✓ product:  $PRODUCT_ID"

# ─── 2. Price ───────────────────────────────────────────────────────────────
echo "2/5  Creating price: \$9.99 USD / month recurring"
PRICE_JSON=$(stripe_post "/prices" \
  -d "product=${PRODUCT_ID}" \
  -d "currency=usd" \
  -d "unit_amount=999" \
  -d "recurring[interval]=month" \
  -d "metadata[app]=workoutpartna" \
  -d "metadata[feature]=ai_daily_coach")
PRICE_ID=$(extract_id "$PRICE_JSON")
echo "     ✓ price:    $PRICE_ID"

# ─── 3. Coupon ──────────────────────────────────────────────────────────────
echo "3/5  Creating coupon: 100% off (duration: once)"
COUPON_JSON=$(stripe_post "/coupons" \
  -d "name=AI Coach Free First Month" \
  -d "percent_off=100" \
  -d "duration=once" \
  -d "metadata[app]=workoutpartna")
COUPON_ID=$(extract_id "$COUPON_JSON")
echo "     ✓ coupon:   $COUPON_ID"

# ─── 4. Promotion code ──────────────────────────────────────────────────────
echo "4/5  Creating promotion code: PARTNA14 (max 100 redemptions)"
PROMO_JSON=$(stripe_post "/promotion_codes" \
  -d "promotion[type]=coupon" \
  -d "promotion[coupon]=${COUPON_ID}" \
  -d "code=PARTNA14" \
  -d "max_redemptions=100" \
  -d "active=true" \
  -d "metadata[app]=workoutpartna")
PROMO_ID=$(extract_id "$PROMO_JSON")
echo "     ✓ promo:    $PROMO_ID  (code: PARTNA14)"

# ─── 5. Webhook endpoint ────────────────────────────────────────────────────
echo "5/5  Creating webhook endpoint → https://workoutpartna.com/api/stripe/webhook"
WEBHOOK_JSON=$(stripe_post "/webhook_endpoints" \
  -d "url=https://workoutpartna.com/api/stripe/webhook" \
  -d "enabled_events[]=checkout.session.completed" \
  -d "enabled_events[]=customer.subscription.created" \
  -d "enabled_events[]=customer.subscription.updated" \
  -d "enabled_events[]=customer.subscription.deleted" \
  -d "enabled_events[]=invoice.paid" \
  -d "enabled_events[]=invoice.payment_failed" \
  -d "metadata[app]=workoutpartna")
WEBHOOK_ID=$(extract_id "$WEBHOOK_JSON")
WEBHOOK_SECRET=$(extract_field "$WEBHOOK_JSON" "secret")
echo "     ✓ webhook:  $WEBHOOK_ID"
echo ""

# ─── Summary ────────────────────────────────────────────────────────────────
echo "════════════════════════════════════════════════════════════════════════"
echo "✅ Provisioning complete. Paste the lines below back to Claude:"
echo "════════════════════════════════════════════════════════════════════════"
echo ""
echo "STRIPE_AI_COACH_PRICE_ID=${PRICE_ID}"
echo "STRIPE_WEBHOOK_SECRET=${WEBHOOK_SECRET}"
echo "STRIPE_PRODUCT_ID=${PRODUCT_ID}      # for reference"
echo "STRIPE_COUPON_ID=${COUPON_ID}         # for reference"
echo "STRIPE_PROMO_ID=${PROMO_ID}            # for reference"
echo "STRIPE_WEBHOOK_ID=${WEBHOOK_ID}        # for reference"
echo ""
echo "Next steps Claude will walk you through:"
echo "  1. vercel env add STRIPE_AI_COACH_PRICE_ID   (paste price_… above)"
echo "  2. vercel env add STRIPE_WEBHOOK_SECRET      (paste whsec_… above)"
echo "  3. vercel env add STRIPE_SECRET_KEY          (paste your sk_live_…)"
echo "  4. vercel env add SUPABASE_SERVICE_ROLE_KEY  (from Supabase dashboard)"
echo "  5. vercel env add ANTHROPIC_API_KEY          (from Anthropic console)"
echo ""
