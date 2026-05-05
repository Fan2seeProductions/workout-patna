// Public footer with site links, FAQ-style content, and SEO copy.
import Link from 'next/link'
import { Logo } from '../app/Logo'

const product = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing',      label: 'Pricing' },
  { href: '/trainers',     label: 'For Trainers' },
  { href: '/safety',       label: 'Safety' },
]
const business = [
  { href: '/for-gyms-apartments', label: 'For Gyms & Apartments' },
  { href: '/for-gyms-apartments#contact', label: 'Request a Demo' },
  { href: '/for-gyms-apartments#partner', label: 'Become a Partner' },
]
const account = [
  { href: '/app/signup', label: 'Create Account' },
  { href: '/app/signin', label: 'Sign In' },
]
const legal = [
  { href: '/terms',   label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
]

export function PublicFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--color-border)] bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo size={32} withWordmark />
          <p className="mt-4 text-[13px] leading-relaxed text-[var(--color-muted-foreground)] max-w-sm">
            WorkoutPartna is a location-based fitness accountability network. We help people find real
            workout partners at the gym, apartment fitness center, or community fitness space they
            already use, and give those locations a way to build a real community around their amenities.
          </p>
          <p className="mt-3 text-[12px] text-[var(--color-muted-foreground)]">
            Launching in Houston, TX. Cypress, Katy, Spring, The Woodlands, Sugar Land, and surrounding areas.
          </p>
        </div>
        <Col title="Product"  items={product}  />
        <Col title="Business" items={business} />
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
