// /pricing — Coach-first pricing.
import Link from 'next/link'
import type { Metadata } from 'next'
import { PublicNav } from '../../components/public/PublicNav'
import { PublicFooter } from '../../components/public/PublicFooter'
import { PageShell, Section, Eyebrow, H2, Lede } from '../../components/public/Section'

export const metadata: Metadata = {
  title: 'Pricing | WorkoutPartna',
  description:
    '14 days free, no credit card. Then $9.99/mo. Cancel anytime. One simple plan for the AI trainer that texts you the exact workout to do today.',
}

const features = [
  'One personalized workout, every day',
  'Texted to you the morning of (or in the app)',
  'Reply MODIFY to rewrite the plan',
  'Reply DONE — tomorrow adapts',
  'Built for home, gym, hotel, travel',
  'No medical claims, no scammy tracking',
]

// Product schema so search engines can extract structured pricing
// (trial + subscription) for rich results.
const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'WorkoutPartna AI Daily Coach',
  description:
    'AI personal trainer subscription: one personalized workout every day, adapted to your goals, equipment, and feedback — delivered by app, text, or voice call.',
  brand: { '@type': 'Brand', name: 'WorkoutPartna' },
  url: 'https://workoutpartna.com/pricing',
  offers: {
    '@type': 'Offer',
    price: '9.99',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: 'https://workoutpartna.com/pricing',
    description: '14-day free trial, then $9.99/month. Cancel anytime.',
  },
}

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <PublicNav />
      <PageShell>

        <Section>
          <Eyebrow>One simple plan</Eyebrow>
          <H2>Free for 14 days. No credit card.</H2>
          <Lede>
            Try the full product. If you keep it past day 14, it's $9.99/mo. Cancel anytime with one tap or one text.
          </Lede>

          <div className="mt-10 max-w-md">
            <div className="relative rounded-2xl p-6 bg-[var(--color-primary)] text-white shadow-2xl">
              <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-[var(--color-secondary)] text-white text-[10px] uppercase font-extrabold tracking-wider">
                14 days free
              </span>
              <h3 className="font-bold text-[18px] text-white">AI Daily Coach</h3>
              <p className="mt-1 text-[13px] text-white/85">Your trainer texts you first.</p>
              <p className="mt-5 text-white">
                <span className="text-[36px] font-extrabold tracking-tight">$9.99</span>
                <span className="ml-1 text-[14px] font-medium text-white/85">/ month after trial</span>
              </p>
              <ul className="mt-5 space-y-2">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-[13.5px]">
                    <span className="shrink-0 mt-0.5 text-white">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 6" />
                      </svg>
                    </span>
                    <span className="text-white/95">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/app/signup"
                className="mt-6 block w-full text-center h-11 rounded-full inline-flex items-center justify-center font-bold text-[14px] bg-white text-[var(--color-primary)]"
              >
                Start my 14 days free
              </Link>
              <p className="mt-3 text-[11px] text-white/70 text-center">
                No credit card. Cancel anytime. Reply STOP to opt out.
              </p>
            </div>
          </div>
        </Section>

        <section className="bg-white border-y border-[var(--color-border)]">
          <Section>
            <Eyebrow>FAQ</Eyebrow>
            <H2>Common questions.</H2>

            <div className="mt-8 grid gap-5 lg:grid-cols-2 max-w-4xl">
              {[
                {
                  q: 'What happens after 14 days?',
                  a: 'We email you a day or two before the trial ends. If you want to keep it, add a card. If not, do nothing — your account stays, but daily plans stop.',
                },
                {
                  q: 'Do I get charged if I forget?',
                  a: 'No. There is no card on file during the trial. We cannot charge you accidentally.',
                },
                {
                  q: 'Can I cancel after I subscribe?',
                  a: 'Yes — one tap in the app, or reply STOP to the daily text. No phone calls, no cancellation forms.',
                },
                {
                  q: 'How is this different from a $200/mo personal trainer?',
                  a: 'A real trainer is great if you can afford one and your schedule lines up. WorkoutPartna is for the other 95% of weeks: tell it your day, get a workout, stay consistent.',
                },
                {
                  q: 'Is there a free forever option?',
                  a: 'Not right now. We focus all the work on making the paid product great. 14 days is enough to know if it works for you.',
                },
                {
                  q: 'What about families or teams?',
                  a: 'Each person needs their own account so the plan adapts to them. We may add a household plan later if there is demand.',
                },
              ].map(f => (
                <div key={f.q} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5">
                  <p className="text-[14px] font-extrabold text-[var(--color-foreground)] mb-1">{f.q}</p>
                  <p className="text-[13px] text-[var(--color-muted-foreground)] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/app/signup"
                className="inline-flex h-12 px-7 rounded-full brand-gradient text-white items-center font-bold text-[14px] shadow-glow"
              >
                Start my 14 days free →
              </Link>
            </div>
          </Section>
        </section>

      </PageShell>
      <PublicFooter />
    </>
  )
}
