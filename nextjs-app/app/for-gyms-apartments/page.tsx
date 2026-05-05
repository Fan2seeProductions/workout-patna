// /for-gyms-apartments — B2B sales page for gyms, apartments, and communities.
import Link from 'next/link'
import type { Metadata } from 'next'
import { PublicNav } from '../../components/public/PublicNav'
import { PublicFooter } from '../../components/public/PublicFooter'
import { PageShell, Section, Eyebrow, H2, Lede } from '../../components/public/Section'
import { PartnerLeadForm } from '../../components/public/PartnerLeadForm'

export const metadata: Metadata = {
  title: 'For Gyms & Apartments | WorkoutPartna',
  description:
    'Turn your fitness space into a real community. WorkoutPartna helps gyms, apartments, fitness centers, and HOAs increase amenity usage, member engagement, and retention.',
}

const benefits = [
  'Increase gym and amenity usage',
  'Improve resident or member engagement',
  'Build a stronger, branded fitness community',
  'Modern amenity differentiator for property tours',
  'Help members stay consistent and renew',
  'Trainer and wellness staff visibility',
  'Promote events, challenges, and community workouts',
  'Branded location hub inside WorkoutPartna',
]

const tiers = [
  {
    name: 'Starter Location',
    price: '$99',
    cadence: '/month',
    body: 'For small apartments, HOAs, and community fitness rooms.',
    features: [
      'Location profile',
      'Member/resident community hub',
      'Basic partner matching',
      'Challenges',
      'Events',
      'QR code invite link',
    ],
    highlight: false,
    cta: 'Start with Starter',
  },
  {
    name: 'Growth Location',
    price: '$199',
    cadence: '/month',
    body: 'For larger apartment communities, boutique gyms, and fitness centers.',
    features: [
      'Everything in Starter',
      'Featured events',
      'Trainer visibility',
      'Engagement analytics',
      'Admin dashboard',
      'Member announcements',
      'Custom onboarding link',
    ],
    highlight: true,
    cta: 'Talk to sales',
  },
  {
    name: 'Network Partner',
    price: 'Custom',
    cadence: 'pricing',
    body: 'For multi-location gyms, property management groups, and city/community wellness programs.',
    features: [
      'Multiple locations',
      'Multi-location reporting',
      'Branded onboarding',
      'Priority support',
      'Custom campaigns',
      'Advanced community tools',
    ],
    highlight: false,
    cta: 'Request custom plan',
  },
]

export default function ForGymsApartmentsPage() {
  return (
    <>
      <PublicNav />
      <PageShell>

        {/* Hero */}
        <section className="relative bg-[var(--color-primary)] text-white overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-14">
            <span className="inline-block text-[11px] uppercase font-bold tracking-[0.18em] bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
              For gyms, apartments, fitness centers
            </span>
            <h1 className="mt-5 text-[34px] sm:text-[46px] font-extrabold leading-[1.05] tracking-tight max-w-3xl">
              Turn Your Fitness Space Into a Real Community.
            </h1>
            <p className="mt-4 text-[16px] sm:text-[18px] leading-relaxed text-white/90 max-w-3xl">
              WorkoutPartna helps your members or residents find accountability partners, join challenges,
              use your fitness amenities more often, and feel more connected to your location.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#contact"
                className="h-12 px-7 rounded-full bg-white text-[var(--color-primary)] inline-flex items-center font-bold text-[15px] shadow-lg"
              >
                Request a Demo
              </Link>
              <Link
                href="#partner"
                className="h-12 px-7 rounded-full border border-white/40 bg-white/10 backdrop-blur inline-flex items-center font-semibold text-[15px] text-white"
              >
                Become a Partner Location
              </Link>
            </div>
          </div>
        </section>

        {/* Business value */}
        <Section>
          <Eyebrow>Why partner locations choose WorkoutPartna</Eyebrow>
          <H2>Stronger community. More usage. Better retention.</H2>
          <Lede>
            Properties and gyms compete on amenities. The fitness center is one of the most expensive
            and most underused. WorkoutPartna activates it.
          </Lede>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(b => (
              <li
                key={b}
                className="rounded-xl border border-[var(--color-border)] bg-white p-4 flex items-start gap-2.5"
              >
                <span className="shrink-0 mt-0.5 h-5 w-5 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 6" />
                  </svg>
                </span>
                <span className="text-[14px] font-medium text-[var(--color-foreground)] leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Pricing */}
        <section id="partner" className="bg-white border-y border-[var(--color-border)]">
          <Section>
            <Eyebrow>Beta partner pricing</Eyebrow>
            <H2>Simple plans built around your location size.</H2>
            <Lede>
              Beta partner pricing may be adjusted for early gyms, apartments, and community partners.
            </Lede>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {tiers.map(t => (
                <div
                  key={t.name}
                  className={`relative rounded-2xl p-6 ${
                    t.highlight
                      ? 'bg-[var(--color-primary)] text-white shadow-2xl scale-[1.02]'
                      : 'bg-white border border-[var(--color-border)]'
                  }`}
                >
                  {t.highlight && (
                    <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-[var(--color-secondary)] text-white text-[10px] uppercase font-extrabold tracking-wider">
                      Most popular
                    </span>
                  )}
                  <h3 className={`font-bold text-[18px] ${t.highlight ? 'text-white' : 'text-[var(--color-foreground)]'}`}>
                    {t.name}
                  </h3>
                  <p className={`mt-1 text-[13px] leading-snug ${t.highlight ? 'text-white/85' : 'text-[var(--color-muted-foreground)]'}`}>
                    {t.body}
                  </p>
                  <p className={`mt-5 ${t.highlight ? 'text-white' : 'text-[var(--color-foreground)]'}`}>
                    <span className="text-[36px] font-extrabold tracking-tight">{t.price}</span>
                    <span className={`ml-1 text-[14px] font-medium ${t.highlight ? 'text-white/85' : 'text-[var(--color-muted-foreground)]'}`}>
                      {t.cadence}
                    </span>
                  </p>
                  <ul className="mt-5 space-y-2">
                    {t.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-[13.5px]">
                        <span className={`shrink-0 mt-0.5 ${t.highlight ? 'text-[var(--color-secondary)]' : 'text-[var(--color-accent)]'}`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12l5 5L20 6" />
                          </svg>
                        </span>
                        <span className={t.highlight ? 'text-white/95' : 'text-[var(--color-foreground)]'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="#contact"
                    className={`mt-6 block w-full text-center h-11 rounded-full inline-flex items-center justify-center font-bold text-[14px] ${
                      t.highlight
                        ? 'bg-white text-[var(--color-primary)]'
                        : 'brand-gradient text-white'
                    }`}
                  >
                    {t.cta}
                  </Link>
                </div>
              ))}
            </div>
          </Section>
        </section>

        {/* Lead form */}
        <Section id="contact">
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <div>
              <Eyebrow>Get in touch</Eyebrow>
              <H2>Bring WorkoutPartna to your community.</H2>
              <Lede>
                Tell us about your location and we'll set up a 20-minute demo. We'll show you the resident
                or member experience, the admin dashboard, and how onboarding works.
              </Lede>
              <ul className="mt-8 space-y-3 text-[14px] text-[var(--color-foreground)]">
                <li className="flex items-start gap-2"><Bullet />Free 7-day partnership trial.</li>
                <li className="flex items-start gap-2"><Bullet />Custom onboarding link for your members or residents.</li>
                <li className="flex items-start gap-2"><Bullet />QR code, signage, and email templates included.</li>
                <li className="flex items-start gap-2"><Bullet />Cancel anytime during beta.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 sm:p-7 shadow-sm">
              <PartnerLeadForm />
            </div>
          </div>
        </Section>

      </PageShell>
      <PublicFooter />
    </>
  )
}

function Bullet() {
  return (
    <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
  )
}
