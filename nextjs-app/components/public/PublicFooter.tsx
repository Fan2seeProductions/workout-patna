// Public footer with site links + brand line. Sits on every non-app page.
// Coach-first: B2B + matching-themed columns dropped. /trainers and
// /for-gyms-apartments still resolve by URL but are not surfaced here.
import Link from 'next/link'
import { Logo } from '../app/Logo'

const product = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/pricing',      label: 'Pricing' },
  { href: '/safety',       label: 'Safety' },
  { href: '/about',        label: 'About' },
]
const account = [
  { href: '/app/signup', label: 'Try free for 14 days' },
  { href: '/app/signin', label: 'Sign in' },
]
const legal = [
  { href: '/terms',   label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/waiver',  label: 'Health & Liability' },
]

export function PublicFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--color-border)] bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size={32} withWordmark />
          <p className="mt-4 text-[13px] leading-relaxed text-[var(--color-muted-foreground)] max-w-sm">
            WorkoutPartna is the AI trainer that texts you the exact workout to do today.
            Personalized to your time, gear, energy, and history. Built for general fitness
            and healthy habit formation — not medical guidance.
          </p>
          <p className="mt-3 text-[12px] text-[var(--color-muted-foreground)]">
            14 days free. No credit card. Then $9.99/mo. Cancel anytime.
          </p>
        </div>
        <Col title="Product"  items={product}  />
        <Col title="Account"  items={account}  />
      </div>

      <div className="border-t border-[var(--color-border)] bg-[var(--color-muted)]/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row gap-3 items-center justify-between text-[12px] text-[var(--color-muted-foreground)]">
          <p>© {new Date().getFullYear()} WorkoutPartna. All rights reserved.</p>
          <div className="flex gap-5">
            {legal.map(l => (
              <Link key={l.href} href={l.href} className="hover:text-[var(--color-foreground)]">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function Col({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-foreground)] mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map(i => (
          <li key={i.href}>
            <Link href={i.href} className="text-[13px] text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
