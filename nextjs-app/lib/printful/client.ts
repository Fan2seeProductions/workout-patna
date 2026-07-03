// Server-only Printful API client. Powers the merch shop:
//   - catalog: sync products/variants from the connected Printful store
//   - fulfillment: create DRAFT orders after Stripe payment (never auto-confirm
//     — the founder reviews and confirms each order in the Printful dashboard,
//     so a bug here can't spend the Printful wallet)
//
// Env:
//   PRINTFUL_API_KEY   — private token (Printful → Settings → Developers → Tokens)
//   PRINTFUL_STORE_ID  — optional; only needed if the token spans multiple stores

const PRINTFUL_API = 'https://api.printful.com'

// Catalog responses are cached for 5 minutes — merch changes rarely and this
// keeps the page fast without hammering Printful's rate limits.
const CATALOG_REVALIDATE_SECONDS = 300

function apiKey(): string | null {
  return process.env.PRINTFUL_API_KEY ?? null
}

function baseHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey()}`,
    'Content-Type': 'application/json',
  }
  if (process.env.PRINTFUL_STORE_ID) {
    headers['X-PF-Store-Id'] = process.env.PRINTFUL_STORE_ID
  }
  return headers
}

export function printfulConfigured(): boolean {
  return Boolean(apiKey())
}

// ── API response shapes (only the fields we read) ────────────────────

type ListItem = {
  id: number
  name: string
  thumbnail_url: string | null
  is_ignored: boolean
}

type SyncVariantRaw = {
  id: number
  name: string            // "Partna Tee / Black / M"
  retail_price: string    // "24.99"
  currency: string
  availability_status: string   // "active" | "discontinued" | ...
  size: string | null
  color: string | null
  files: Array<{ type: string; preview_url: string | null }>
}

// ── Public shapes consumed by the merch page ─────────────────────────

export type MerchVariant = {
  id: number              // Printful sync_variant_id — the checkout key
  size: string | null
  color: string | null
  priceCents: number
  image: string | null    // print-file preview if available
}

export type MerchProduct = {
  id: number              // Printful sync_product_id
  name: string
  image: string | null
  priceCents: number      // lowest variant price
  sizes: string[]
  colors: string[]
  variants: MerchVariant[]
}

function toCents(retail: string): number {
  const n = Number.parseFloat(retail)
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

/**
 * Fetch the full store catalog: product list, then variants per product.
 * Returns [] if Printful isn't configured or the API errors — the shop page
 * renders its empty state rather than crashing.
 */
export async function getMerchCatalog(): Promise<MerchProduct[]> {
  if (!printfulConfigured()) return []

  try {
    const listRes = await fetch(`${PRINTFUL_API}/store/products?limit=100`, {
      headers: baseHeaders(),
      next: { revalidate: CATALOG_REVALIDATE_SECONDS },
    })
    if (!listRes.ok) {
      console.error('[printful] product list failed:', listRes.status, await listRes.text())
      return []
    }
    const list = (await listRes.json()).result as ListItem[]
    const visible = (list ?? []).filter(p => !p.is_ignored)

    const products = await Promise.all(visible.map(async (item): Promise<MerchProduct | null> => {
      const res = await fetch(`${PRINTFUL_API}/store/products/${item.id}`, {
        headers: baseHeaders(),
        next: { revalidate: CATALOG_REVALIDATE_SECONDS },
      })
      if (!res.ok) return null
      const detail = (await res.json()).result as { sync_variants: SyncVariantRaw[] }

      const variants: MerchVariant[] = (detail.sync_variants ?? [])
        .filter(v => v.availability_status === 'active')
        .map(v => ({
          id: v.id,
          size: v.size,
          color: v.color,
          priceCents: toCents(v.retail_price),
          image: v.files.find(f => f.type === 'preview')?.preview_url ?? null,
        }))

      if (!variants.length) return null

      return {
        id: item.id,
        name: item.name,
        image: item.thumbnail_url,
        priceCents: Math.min(...variants.map(v => v.priceCents)),
        sizes: [...new Set(variants.map(v => v.size).filter((s): s is string => Boolean(s)))],
        colors: [...new Set(variants.map(v => v.color).filter((c): c is string => Boolean(c)))],
        variants,
      }
    }))

    return products.filter((p): p is MerchProduct => p !== null)
  } catch (err) {
    console.error('[printful] catalog fetch error:', err)
    return []
  }
}

/** Fetch a single sync variant (used by checkout to price server-side). */
export async function getVariant(syncVariantId: number): Promise<
  { name: string; priceCents: number; image: string | null } | null
> {
  if (!printfulConfigured()) return null
  try {
    const res = await fetch(`${PRINTFUL_API}/store/variants/${syncVariantId}`, {
      headers: baseHeaders(),
      next: { revalidate: CATALOG_REVALIDATE_SECONDS },
    })
    if (!res.ok) return null
    const v = (await res.json()).result as SyncVariantRaw
    if (v.availability_status !== 'active') return null
    return {
      name: v.name,
      priceCents: toCents(v.retail_price),
      image: v.files.find(f => f.type === 'preview')?.preview_url ?? null,
    }
  } catch {
    return null
  }
}

// ── Order creation (draft only) ───────────────────────────────────────

export type OrderRecipient = {
  name: string
  address1: string
  address2?: string | null
  city: string
  state_code?: string | null
  country_code: string
  zip: string
  email?: string | null
}

/**
 * Create a DRAFT Printful order (confirm=false is Printful's default — the
 * order sits in the dashboard until manually confirmed, so no fulfillment
 * cost is incurred automatically).
 *
 * `externalId` should be the Stripe checkout session id: Printful rejects a
 * duplicate external_id, which makes Stripe webhook retries safe.
 */
export async function createDraftOrder(args: {
  externalId: string
  recipient: OrderRecipient
  syncVariantId: number
  quantity?: number
}): Promise<{ ok: boolean; orderId?: number; error?: string }> {
  if (!printfulConfigured()) return { ok: false, error: 'PRINTFUL_API_KEY not set' }

  const res = await fetch(`${PRINTFUL_API}/orders`, {
    method: 'POST',
    headers: baseHeaders(),
    body: JSON.stringify({
      external_id: args.externalId,
      recipient: args.recipient,
      items: [{ sync_variant_id: args.syncVariantId, quantity: args.quantity ?? 1 }],
    }),
  })

  const json = await res.json().catch(() => null)

  // A 2xx with an unparseable body must NOT be treated as success — that
  // would stop Stripe's retries while no Printful order exists (paid but
  // never fulfilled). Fail so the webhook 500s and Stripe retries.
  if (res.ok && !json) {
    return { ok: false, error: `Printful returned ${res.status} with an unparseable body` }
  }

  if (!res.ok) {
    const message: string = json?.result ?? json?.error?.message ?? `HTTP ${res.status}`
    // Duplicate external_id → this session's order already exists (webhook
    // retry). Treat as success so Stripe stops retrying.
    if (typeof message === 'string' && message.toLowerCase().includes('external id')) {
      return { ok: true, orderId: -1 }
    }
    return { ok: false, error: message }
  }

  return { ok: true, orderId: (json?.result?.id as number) ?? -1 }
}
