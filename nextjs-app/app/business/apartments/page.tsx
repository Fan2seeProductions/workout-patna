// /business/apartments — sales landing for apartment leasing managers.
// Pitches retention + amenity utilization. Captures leads.
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Building2, TrendingUp, Users, Dumbbell, Star, Shield,
  Calendar, MessageCircle, Check, ArrowRight, Sparkles,
} from 'lucide-react'
import { Logo } from '../../../components/app/Logo'
import { ClaimForm } from './ClaimForm'

export const metadata: Metadata = {
  title: 'WorkoutPartna for Apartment Communities',
  description:
    'Drive resident retention and amenity utilization. Turn your fitness center into a community. Free for apartments — claim your property in minutes.',
}

export default function ApartmentsLanding() {
  return (
    <main className="min-h-dvh bg-[var(--color-background)] text-[var(--color-foreground)]">

      {/* Top bar */}
      <header className="border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo size={32} />
          </Link>
          <nav className="flex items-center gap-3">
            <a href="#claim" className="hidden md:inline text-sm font-bold text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">
              Claim your property
            </a>
            <a href="#claim" className="md:hidden text-sm font-bold bg-[var(--color-secondary)] text-white px-3 py-1.5 rounded-full">
              Claim
            </a>
            <a href="#claim" className="hidden md:inline text-sm font-bold bg-[var(--color-secondary)] text-white px-4 py-2 rounded-full hover:opacity-90">
              Get started
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
              <Sparkles className="w-3 h-3" />
              For Apartment Communities
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-display leading-[1.05] tracking-tight">
              Your fitness center is empty.
              <br />
              <span className="brand-gradient-text">Fix that in 2 weeks.</span>
            </h1>
            <p className="mt-5 text-lg text-[var(--color-muted-foreground)] leading-relaxed max-w-xl">
              WorkoutPartna turns your residents into a workout community.
              Higher amenity utilization. Stickier leases. Better resident reviews.
              Free to claim your property.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a
                href="#claim"
                className="inline-flex items-center justify-center gap-2 bg-[var(--color-secondary)] text-white font-bold px-6 py-3.5 rounded-xl text-base hover:opacity-90 transition shadow-lg"
              >
                Claim your property <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center gap-2 bg-white text-[var(--color-foreground)] font-bold px-6 py-3.5 rounded-xl text-base border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition"
              >
                See how it works
              </a>
            </div>
            <p className="mt-3 text-xs text-[var(--color-muted-foreground)]">
              No setup fees. 14-day pilot. Cancel anytime.
            </p>
          </div>

          {/* Hero stat card */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={<TrendingUp className="w-5 h-5" />} value="3.2x" label="Fitness center visits per resident" tint="bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]" />
            <StatCard icon={<Users className="w-5 h-5" />} value="62%" label="Of residents who join workout with a neighbor in 30 days" tint="bg-[var(--color-primary)]/10 text-[var(--color-primary)]" />
            <StatCard icon={<Star className="w-5 h-5" />} value="+0.4" label="Stars on Google reviews after 90 days" tint="bg-[var(--color-accent)]/10 text-[var(--color-accent)]" />
            <StatCard icon={<Calendar className="w-5 h-5" />} value="11%" label="Lift in lease renewals at pilot properties" tint="bg-amber-100 text-amber-700" />
            <p className="col-span-2 text-[10px] text-[var(--color-muted-foreground)] text-center">
              Pilot data from Houston-area apartment communities. Results vary by property.
            </p>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-white border-y border-[var(--color-border)]">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-center max-w-3xl mx-auto">
            Your residents pay for amenities they never use.
          </h2>
          <p className="text-center text-lg text-[var(--color-muted-foreground)] mt-4 max-w-2xl mx-auto">
            72% of residents say the gym was a top-3 reason they signed the lease.
            Less than 18% use it more than once a week. The gap is community, not equipment.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <ProblemCard
              before="Empty fitness center at 7 PM"
              after="Resident-only workout meetups every weeknight"
            />
            <ProblemCard
              before='Resident leaves a "amenities suck" review'
              after="Residents tag your property in their workout posts"
            />
            <ProblemCard
              before="Renewals dropping every quarter"
              after="Residents don’t want to leave their gym crew"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-center">
          Live in your community in 14 days.
        </h2>
        <p className="text-center text-lg text-[var(--color-muted-foreground)] mt-3 max-w-2xl mx-auto">
          We do the heavy lifting. You just put up a flyer.
        </p>

        <div className="mt-12 grid md:grid-cols-4 gap-6">
          {[
            { n: 1, title: 'Claim your property', desc: 'Submit the form below. We verify in 1 business day.' },
            { n: 2, title: 'We brand your community page', desc: 'Verified badge, your logo, your colors, your fitness center photos.' },
            { n: 3, title: 'Soft launch to residents', desc: 'We send your residents a flyer + QR code. Optional launch event we co-host.' },
            { n: 4, title: 'Watch the gym fill up', desc: 'Monthly utilization + retention dashboard delivered to your inbox.' },
          ].map(s => (
            <div key={s.n} className="bg-white border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
              <div className="h-10 w-10 rounded-xl brand-gradient text-white font-black flex items-center justify-center mb-3">{s.n}</div>
              <h3 className="font-bold text-[var(--color-foreground)] mb-1">{s.title}</h3>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-[var(--color-primary)]/[0.02] border-y border-[var(--color-border)]">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-center mb-12">
            Built for property managers, loved by residents.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Feature icon={<Shield className="w-5 h-5" />} title="Verified Community Badge"
              body="Your property gets the green ✓ on the Communities page. Residents trust the badge." />
            <Feature icon={<Building2 className="w-5 h-5" />} title="Branded Property Page"
              body="Your logo, photos, hours, and amenity list. Residents can RSVP to events you post." />
            <Feature icon={<Users className="w-5 h-5" />} title="Resident-Only Matching"
              body="Free residents only see other residents at the same property. Tighter community, instant trust." />
            <Feature icon={<Dumbbell className="w-5 h-5" />} title="Free Trainer Spotlight"
              body="Your apartment gets one free personal trainer slot to offer residents free 30-min consultations." />
            <Feature icon={<MessageCircle className="w-5 h-5" />} title="Property-Wide Announcements"
              body="Push messages to all residents about pool parties, new equipment, or wellness challenges." />
            <Feature icon={<TrendingUp className="w-5 h-5" />} title="Monthly Utilization Report"
              body="Show ownership the data: amenity visits, signup rate, renewal correlation." />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-center mb-3">
          Simple pricing.
        </h2>
        <p className="text-center text-lg text-[var(--color-muted-foreground)] mb-12">
          No setup fees. Cancel any time.
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <PricingCard
            tier="Free"
            price="$0"
            unit="/mo"
            tagline="Get listed."
            cta="Claim free"
            features={[
              'Verified property badge',
              'Resident-only matching',
              'Listed on Communities page',
              'Manager dashboard (basic)',
            ]}
          />
          <PricingCard
            tier="Starter"
            price="$149"
            unit="/mo"
            tagline="Most popular for properties under 200 units."
            featured
            cta="Start 14-day pilot"
            features={[
              'Everything in Free',
              'Branded property page (logo, colors, photos)',
              'Free trainer spotlight slot',
              'Property-wide announcements',
              'Monthly utilization report',
              '1 sponsored monthly challenge',
            ]}
          />
          <PricingCard
            tier="Growth"
            price="$299"
            unit="/mo"
            tagline="For 200+ unit properties or portfolios."
            cta="Talk to sales"
            features={[
              'Everything in Starter',
              'Multi-property dashboard',
              'Custom QR code flyers + signage kit',
              'Quarterly business review',
              'Co-marketed launch event',
              'Direct line to founders',
            ]}
          />
        </div>
      </section>

      {/* Lead form */}
      <section id="claim" className="bg-[var(--color-foreground)] text-white">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight">
              Claim your property.
            </h2>
            <p className="text-white/70 mt-3 text-lg">
              Takes 60 seconds. We'll respond within 1 business day.
            </p>
          </div>
          <ClaimForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-foreground)] text-white/60 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size={28} />
            <span className="font-bold text-white">WorkoutPartna</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/app" className="hover:text-white">Consumer app</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <a href="mailto:sales@fan2seeproductions.com" className="hover:text-white">sales@fan2seeproductions.com</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

function StatCard({ icon, value, label, tint }: { icon: React.ReactNode; value: string; label: string; tint: string }) {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
      <div className={`inline-flex items-center justify-center h-9 w-9 rounded-xl mb-3 ${tint}`}>{icon}</div>
      <p className="text-3xl font-black tracking-tight">{value}</p>
      <p className="text-xs text-[var(--color-muted-foreground)] leading-snug mt-1">{label}</p>
    </div>
  )
}

function ProblemCard({ before, after }: { before: string; after: string }) {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">Before</p>
      <p className="text-base text-[var(--color-foreground)] mb-5 leading-snug">{before}</p>
      <div className="border-t border-dashed border-[var(--color-border)] pt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-2">With WorkoutPartna</p>
        <p className="text-base text-[var(--color-foreground)] leading-snug">{after}</p>
      </div>
    </div>
  )
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <div className="h-10 w-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-3">{icon}</div>
      <h3 className="font-bold text-[var(--color-foreground)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{body}</p>
    </div>
  )
}

function PricingCard({
  tier, price, unit, tagline, features, cta, featured = false,
}: {
  tier: string; price: string; unit: string; tagline: string; features: string[]; cta: string; featured?: boolean
}) {
  return (
    <div className={`rounded-3xl p-6 border shadow-sm relative ${featured ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xl scale-[1.02]' : 'bg-white text-[var(--color-foreground)] border-[var(--color-border)]'}`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-secondary)] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
          Most popular
        </div>
      )}
      <p className={`text-sm font-bold uppercase tracking-wider ${featured ? 'text-white/70' : 'text-[var(--color-muted-foreground)]'}`}>{tier}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-4xl font-black">{price}</span>
        <span className={`text-sm ${featured ? 'text-white/70' : 'text-[var(--color-muted-foreground)]'}`}>{unit}</span>
      </div>
      <p className={`mt-2 text-sm ${featured ? 'text-white/85' : 'text-[var(--color-muted-foreground)]'}`}>{tagline}</p>
      <ul className="mt-5 space-y-2">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className={`w-4 h-4 mt-0.5 shrink-0 ${featured ? 'text-[var(--color-secondary)]' : 'text-[var(--color-accent)]'}`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <a
        href="#claim"
        className={`mt-6 inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition ${
          featured
            ? 'bg-[var(--color-secondary)] text-white hover:opacity-90'
            : 'bg-[var(--color-foreground)] text-white hover:opacity-90'
        }`}
      >
        {cta} <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  )
}
