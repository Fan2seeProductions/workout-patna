// Merch shop client — Printful-backed. Category tabs (All / Apparel /
// Accessories), product grid, and a detail modal with size + color pickers
// that resolve to a Printful variant and start a Stripe Checkout.
'use client'

import { useEffect, useMemo, useState } from 'react'
import { ShoppingBag, Package, Shirt } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import type { MerchProduct, MerchVariant } from '../../../../lib/printful/client'

// Printful sync products carry no category — apparel is anything sized.
function categoryOf(p: MerchProduct): 'apparel' | 'accessories' {
  return p.sizes.length > 0 ? 'apparel' : 'accessories'
}

const categoryIcons: Record<string, typeof ShoppingBag> = {
  apparel: Shirt,
  accessories: Package,
  all: ShoppingBag,
}

function emojiFor(p: MerchProduct) {
  const n = p.name.toLowerCase()
  if (p.sizes.length > 0) return '👕'
  if (n.includes('bottle') || n.includes('shaker')) return '🧴'
  if (n.includes('cap') || n.includes('hat') || n.includes('beanie')) return '🧢'
  if (n.includes('sock')) return '🧦'
  if (n.includes('sticker')) return '✨'
  if (n.includes('towel')) return '🧻'
  if (n.includes('bag') || n.includes('tote')) return '🎒'
  if (n.includes('mug') || n.includes('tumbler')) return '☕'
  return '📦'
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

function colorSwatch(color: string) {
  const c = color.toLowerCase()
  if (c.includes('navy')) return '#1e3a5f'
  if (c.includes('heather')) return '#9CA3AF'
  if (c.includes('charcoal')) return '#36454F'
  if (c.includes('orange')) return '#F38B2B'
  if (c.includes('coral')) return '#FF7F50'
  if (c.includes('khaki')) return '#C3B091'
  return c
}

export function MerchClient({ products }: { products: MerchProduct[] }) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'apparel' | 'accessories'>('all')
  const [selected, setSelected] = useState<MerchProduct | null>(null)
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(message: string) {
    setToast(message)
    setTimeout(() => setToast(null), 3200)
  }

  // Post-checkout return states (?status=success|cancel from Stripe redirect)
  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get('status')
    if (status === 'success') showToast('Order placed! 🎉 We’re getting it printed.')
    if (status === 'cancel') showToast('Checkout cancelled — your gear is still here.')
    if (status) window.history.replaceState({}, '', window.location.pathname)
  }, [])

  const filtered = useMemo(() =>
    activeCategory === 'all' ? products : products.filter(p => categoryOf(p) === activeCategory),
  [products, activeCategory])

  // Resolve the Printful variant for the current size/color selection.
  const selectedVariant: MerchVariant | null = useMemo(() => {
    if (!selected) return null
    const matches = selected.variants.filter(v =>
      (selected.sizes.length === 0 || v.size === size) &&
      (selected.colors.length === 0 || v.color === color),
    )
    return matches[0] ?? null
  }, [selected, size, color])

  function close() {
    setSelected(null)
    setSize('')
    setColor('')
  }

  async function buyNow(p: MerchProduct) {
    if (p.sizes.length > 0 && !size) return showToast('Pick a size first.')
    if (p.colors.length > 0 && !color) return showToast('Pick a color first.')
    if (!selectedVariant) return showToast('That combo isn’t available — try another size or color.')

    setBusy(true)
    try {
      const res = await fetch('/api/merch/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId: selectedVariant.id }),
      })
      const json = await res.json()
      if (!res.ok || !json.url) {
        showToast(json.error ?? 'Couldn’t start checkout — try again →')
        setBusy(false)
        return
      }
      window.location.href = json.url
    } catch {
      showToast('Couldn’t start checkout — try again →')
      setBusy(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 pb-24">

      <header className="text-center pt-2">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[var(--color-primary)]/20 mb-4">
          <ShoppingBag className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-display text-[var(--color-foreground)]">
          Workout Partna Gear
        </h1>
        <p className="text-[var(--color-muted-foreground)] mt-2 text-lg">
          Built for people who actually show up.
        </p>
        <p className="text-white font-medium mt-1">
          Wear the mindset. Rep the consistency.
        </p>
      </header>

      {/* Category tabs */}
      <div className="flex gap-2 p-1 bg-[var(--color-muted)] rounded-xl max-w-md mx-auto">
        {(['all', 'apparel', 'accessories'] as const).map(cat => {
          const Icon = categoryIcons[cat] ?? ShoppingBag
          const on = activeCategory === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'flex-1 py-3 px-4 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2',
                on
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
              )}
            >
              <Icon className="w-4 h-4" />
              {cat[0].toUpperCase() + cat.slice(1)}
            </button>
          )
        })}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white/[0.04] rounded-2xl border border-white/10">
            <Package className="w-12 h-12 text-[var(--color-muted-foreground)] mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2 text-[var(--color-foreground)]">No products yet</h3>
            <p className="text-[var(--color-muted-foreground)] text-sm">Check back soon for new gear!</p>
          </div>
        ) : filtered.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p)}
            className="bg-white/[0.04] rounded-2xl overflow-hidden border border-white/10 hover:bg-white/[0.06] transition cursor-pointer text-left group"
          >
            <div className="aspect-square bg-gradient-to-br from-[var(--color-muted)] to-[var(--color-muted)]/50 flex items-center justify-center relative overflow-hidden">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <span className="text-5xl group-hover:scale-110 transition-transform">{emojiFor(p)}</span>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-bold text-sm leading-tight text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition line-clamp-2">{p.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-white">{formatPrice(p.priceCents)}</span>
                {p.colors.length > 0 && (
                  <div className="flex gap-1">
                    {p.colors.slice(0, 3).map((c, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full border border-[var(--color-border)]"
                        style={{ backgroundColor: colorSwatch(c) }}
                        title={c}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 bg-[var(--color-foreground)] text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* Product modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={close}>
          <div className="bg-[#141414] border border-white/10 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="aspect-square bg-gradient-to-br from-[var(--color-muted)] to-[var(--color-muted)]/50 flex items-center justify-center relative overflow-hidden">
              {(selectedVariant?.image ?? selected.image) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedVariant?.image ?? selected.image ?? ''} alt={selected.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-8xl">{emojiFor(selected)}</span>
              )}
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-gray-900 hover:bg-white transition"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">{categoryOf(selected)}</span>
                <h2 className="text-2xl font-bold text-[var(--color-foreground)]">{selected.name}</h2>
              </div>

              <div className="text-3xl font-bold text-white">
                {formatPrice(selectedVariant?.priceCents ?? selected.priceCents)}
              </div>

              {selected.sizes.length > 0 && (
                <div>
                  <label className="text-sm font-bold text-[var(--color-muted-foreground)] mb-2 block">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {selected.sizes.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={cn(
                          'px-4 py-2 rounded-lg border font-medium text-sm transition',
                          size === s
                            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                            : 'bg-white/[0.04] text-white border-white/15 hover:border-[var(--color-primary)] hover:bg-white/[0.08]',
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selected.colors.length > 0 && (
                <div>
                  <label className="text-sm font-bold text-[var(--color-muted-foreground)] mb-2 block">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {selected.colors.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={cn(
                          'px-4 py-2 rounded-lg border font-medium text-sm transition',
                          color === c
                            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                            : 'bg-white/[0.04] text-white border-white/15 hover:border-[var(--color-primary)] hover:bg-white/[0.08]',
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={busy}
                onClick={() => buyNow(selected)}
                className="w-full py-4 bg-[var(--color-primary)] text-white rounded-xl font-bold text-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-5 h-5" />
                {busy ? 'Heading to checkout…' : 'Grab Yours'}
              </button>

              <p className="text-xs text-center text-[var(--color-muted-foreground)]">
                Printed on demand & shipped to your door. Built for accountability.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
