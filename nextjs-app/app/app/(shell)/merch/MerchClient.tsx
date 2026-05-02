// Merch shop client. Featured row, category tabs (All / Apparel / Accessories),
// product grid, and a product detail modal with size + color pickers.
'use client'

import { useState, useMemo } from 'react'
import { ShoppingBag, Star, Package, Shirt } from 'lucide-react'
import { cn } from '../../../../lib/utils'

export type Product = {
  id: string
  name: string
  description: string
  category: string
  price: number
  image: string | null
  sizes: string[] | null
  colors: string[] | null
  in_stock: boolean
  featured: boolean
}

const categoryIcons: Record<string, typeof ShoppingBag> = {
  apparel: Shirt,
  accessories: Package,
  gear: Package,
  all: ShoppingBag,
}

function emojiFor(p: Product) {
  if (p.category === 'apparel') return '👕'
  const n = p.name.toLowerCase()
  if (n.includes('bottle') || n.includes('shaker')) return '🧴'
  if (n.includes('cap')) return '🧢'
  if (n.includes('strap')) return '🏋️'
  if (n.includes('sock')) return '🧦'
  if (n.includes('sticker')) return '✨'
  if (n.includes('towel')) return '🧻'
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

export function MerchClient({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'apparel' | 'accessories' | 'gear'>('all')
  const [selected, setSelected] = useState<Product | null>(null)
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const filtered = useMemo(() =>
    activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory),
  [products, activeCategory])

  const featured = useMemo(() => products.filter(p => p.featured).slice(0, 3), [products])

  function close() {
    setSelected(null)
    setSize('')
    setColor('')
  }

  function addToCart(p: Product) {
    if (p.sizes && p.sizes.length > 0 && !size) {
      setToast('Pick a size first.')
      setTimeout(() => setToast(null), 2200)
      return
    }
    if (p.colors && p.colors.length > 0 && !color) {
      setToast('Pick a color first.')
      setTimeout(() => setToast(null), 2200)
      return
    }
    setToast(`Added ${p.name}${size ? ` · ${size}` : ''}${color ? ` · ${color}` : ''}`)
    setTimeout(() => setToast(null), 2200)
    close()
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 pb-24">

      <header className="text-center pt-2">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[var(--color-secondary)]/20 mb-4">
          <ShoppingBag className="w-8 h-8 text-[var(--color-secondary)]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-display text-[var(--color-foreground)]">
          Workout Partna Gear
        </h1>
        <p className="text-[var(--color-muted-foreground)] mt-2 text-lg">
          Built for people who actually show up.
        </p>
        <p className="text-[var(--color-secondary)] font-medium mt-1">
          Wear the mindset. Rep the consistency.
        </p>
      </header>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="bg-gradient-to-r from-[var(--color-secondary)]/10 via-[var(--color-secondary)]/5 to-[var(--color-primary)]/5 rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-[var(--color-secondary)] fill-[var(--color-secondary)]" />
            <h2 className="text-xl font-bold font-display text-[var(--color-foreground)]">Featured Gear</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p)}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer text-left group"
              >
                <div className="aspect-square bg-gradient-to-br from-[var(--color-muted)] to-[var(--color-muted)]/50 flex items-center justify-center relative overflow-hidden">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <span className="text-6xl">{emojiFor(p)}</span>
                  )}
                  <div className="absolute top-3 right-3 bg-[var(--color-secondary)] text-white text-xs font-bold px-2 py-1 rounded-full">
                    Featured
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">{p.name}</h3>
                  <p className="text-[var(--color-muted-foreground)] text-sm mt-1 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-bold text-[var(--color-secondary)]">{formatPrice(p.price)}</span>
                    <span className="text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider">{p.category}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

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
                  ? 'bg-white shadow-sm text-[var(--color-foreground)]'
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
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-[var(--color-border)]">
            <Package className="w-12 h-12 text-[var(--color-muted-foreground)] mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2 text-[var(--color-foreground)]">No products yet</h3>
            <p className="text-[var(--color-muted-foreground)] text-sm">Check back soon for new gear!</p>
          </div>
        ) : filtered.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p)}
            className="bg-white rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm hover:shadow-md transition cursor-pointer text-left group"
          >
            <div className="aspect-square bg-gradient-to-br from-[var(--color-muted)] to-[var(--color-muted)]/50 flex items-center justify-center relative overflow-hidden">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <span className="text-5xl group-hover:scale-110 transition-transform">{emojiFor(p)}</span>
              )}
              {p.featured && (
                <div className="absolute top-2 right-2">
                  <Star className="w-4 h-4 text-[var(--color-secondary)] fill-[var(--color-secondary)]" />
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-bold text-sm leading-tight text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition line-clamp-2">{p.name}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-[var(--color-secondary)]">{formatPrice(p.price)}</span>
                {p.colors && p.colors.length > 0 && (
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
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 bg-[var(--color-foreground)] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* Product modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={close}>
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="aspect-square bg-gradient-to-br from-[var(--color-muted)] to-[var(--color-muted)]/50 flex items-center justify-center relative overflow-hidden">
              {selected.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-8xl">{emojiFor(selected)}</span>
              )}
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center text-[var(--color-foreground)] hover:bg-white transition"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[var(--color-secondary)] uppercase tracking-wider">{selected.category}</span>
                  {selected.featured && (
                    <span className="text-xs font-bold text-white bg-[var(--color-secondary)] px-2 py-0.5 rounded-full">Featured</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-foreground)]">{selected.name}</h2>
                <p className="text-[var(--color-muted-foreground)] mt-2">{selected.description}</p>
              </div>

              <div className="text-3xl font-bold text-[var(--color-secondary)]">{formatPrice(selected.price)}</div>

              {selected.sizes && selected.sizes.length > 0 && (
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
                            : 'bg-white text-[var(--color-foreground)] border-[var(--color-border)] hover:border-[var(--color-primary)]',
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selected.colors && selected.colors.length > 0 && (
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
                            : 'bg-white text-[var(--color-foreground)] border-[var(--color-border)] hover:border-[var(--color-primary)]',
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
                onClick={() => addToCart(selected)}
                className="w-full py-4 bg-[var(--color-secondary)] text-white rounded-xl font-bold text-lg hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart, Show Up Anyway
              </button>

              <p className="text-xs text-center text-[var(--color-muted-foreground)]">
                Built for accountability. Worn by people who don&rsquo;t quit.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
