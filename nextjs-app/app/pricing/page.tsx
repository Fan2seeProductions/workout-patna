// /pricing — combined pricing for users (free + AI Coach) and partners.
import Link from 'next/link'
import type { Metadata } from 'next'
import { PublicNav } from '../../components/public/PublicNav'
import { PublicFooter } from '../../components/public/PublicFooter'
import { PageShell, Section, Eyebrow, H2, Lede } from '../../components/public/Section'

export const metadata: Metadata = {
  title: 'Pricing | WorkoutPartna',
  description:
    'Free for individuals. Optional $9.99/mo AI Daily Coach. Partner pricing for gyms, apartments, and communities starts at $99/mo.',
}

const userPlans = [
  {
    name: 'Free',
    price: '$0',
    cadence: '/forever',
    body: 'Match, message, and stay accountable at your gym.',
    features: ['Location-based matching', 'Compatibility scoring', 'Workout invites', 'Daily check-ins', 'Local challenges'],
    cta: 'Find My Partna',
    href: '/app/signup',
    highlight: false,
  },
  {
    name: 'AI Daily Coach',
    price: '$9.99',
    cadence: '/month',
    body: 'Personalized AI workouts, expanded filters, and priority placement.',
    features: ['Everything in Free', 'AI workout reminders', 'Expanded filters', 'Priority profile placement', 'Suggested partner matches'],
    cta: 'Try free for 7 days',
    href: '/app/coach',
    highlight: true,
  },
]

const partnerPlans = [
  { name: 'Starter Location',  price: '$99',  cadence: '/month',  body: 'Small apartments, HOAs, community fitness rooms.' },
  { name: 'Growth Location',   price: '$199', cadence: '/month',  body: 'Larger apartments, boutique gyms, fitness centers.' },
  { name: 'Network Partner',   price: 'Custom', cadence: 'pricing', body: 'Multi-location gyms, property management groups, city wellness programs.' },
]

export default function PricingPage() {
  return (
    <>
      <PublicNav />
      <PageShell>

        <Section>
          <Eyebrow>For individuals</Eyebrow>
          <H2>Free to find your Partna. Forever.</H2>
          <Lede>
            Matching, messaging, and accountability are free. AI Daily Coach is optional.
          </Lede>

          <div className="mt-10 grid gap-5 lg:grid-cols-2 max-w-4xl">
            {userPlans.map(p => (
              <div
                key={p.name}
                className={`relative rounded-2xl p-6 ${
                  p.highlight
                    ? 'bg-[var(--color-primary)] text-white shadow-2xl'
                    : 'bg-white border border-[var(--color-border)]'
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-[10px] uppercase font-extrabold tracking-wider">
                    Premium
                  </span>
                )}
                <h3 className={`font-bold text-[18px] ${p.highlight ? 'text-white' : 'text-[var(--color-foreground)]'}`}>{p.name}</h3>
                <p className={`mt-1 text-[13px] ${p.highlight ? 'text-white/85' : 'text-[var(--color-muted-foreground)]'}`}>{p.body}</p>
                <p className={`mt-5 ${p.highlight ? 'text-white' : 'text-[var(--color-foreground)]'}`}>
                  <span className="text-[36px] font-extrabold tracking-tight">{p.price}</span>
                  <span className={`ml-1 text-[14px] font-medium ${p.highlight ? 'text-white/85' : 'text-[var(--color-muted-foreground)]'}`}>
                    {p.cadence}
                  </span>
                </p>
                <ul className="mt-5 space-y-2">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-[13.5px]">
                      <span className={`shrink-0 mt-0.5 ${p.highlight ? 'text-white' : 'text-[var(--color-accent)]'}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12l5 5L20 6" />
                        </svg>
                      </span>
                      <span className={p.highlight ? 'text-white/95' : 'text-[var(--color-foreground)]'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={`mt-6 block w-full text-center h-11 rounded-full inline-flex items-center justify-center font-bold text-[14px] ${
                    p.highlight ? 'bg-white text-[var(--color-primary)]' : 'brand-gradient text-white'
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </Section>

        <section className="bg-white border-y border-[var(--color-border)]">
          <Section>
            <Eyebrow>For gyms, apartments, and communities</Eyebrow>
            <H2>Bring WorkoutPartna to your location.</H2>
            <Lede>
              Beta partner pricing. Plans may be adjusted for early gyms, apartments, and community partners.
            </Lede>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {partnerPlans.map(p => (
                <div key={p.name} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-6">
                  <h3 className="font-bold text-[16px] text-[var(--color-foreground)]">{p.name}</h3>
                  <p className="mt-1 text-[13px] text-[var(--color-muted-foreground)]">{p.body}</p>
                  <p className="mt-4 text-[var(--color-foreground)]">
                    <span className="text-[28px] font-extrabold">{p.price}</span>
                    <span className="ml-1 text-[13px] text-[var(--color-muted-foreground)]">{p.cadence}</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/for-gyms-apartments"
                className="inline-flex h-11 px-6 rounded-full brand-gradient text-white items-center font-bold text-[14px] shadow-glow"
              >
                See full partner plan details →
              </Link>
            </div>
          </Section>
        </section>

      </PageShell>
      <PublicFooter />
    </>
  )
}
