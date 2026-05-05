// /trainers — public-facing recruitment page for fitness trainers.
import Link from 'next/link'
import type { Metadata } from 'next'
import { PublicNav } from '../../components/public/PublicNav'
import { PublicFooter } from '../../components/public/PublicFooter'
import { PageShell, Section, Eyebrow, H2, Lede } from '../../components/public/Section'

export const metadata: Metadata = {
  title: 'For Trainers | WorkoutPartna',
  description:
    'Get discovered by people already searching for fitness support in your local area. Free trainer profiles during beta. Free consultations, real local clients.',
}

const benefits = [
  { title: 'Local visibility', body: 'Appear next to gym members and apartment residents who are already looking to train.' },
  { title: 'Free during beta',  body: 'No subscription. List your profile, specialties, and availability with no fee while we onboard the first network of trainers.' },
  { title: 'Free consultations',body: 'Built-in consultation request form. Convert curious users into paid clients in your own pricing structure.' },
  { title: 'Verified locations',body: 'Tie your profile to specific gyms, apartments, or community spaces you serve.' },
  { title: 'Real accountability', body: 'Users on WorkoutPartna are already committed to showing up. You meet them at the right moment.' },
  { title: 'Your branding',     body: 'Your photo, bio, certifications, schedule, and booking link. We do not get between you and your client.' },
]

const steps = [
  { n: 1, title: 'Apply for a trainer profile', body: 'Tell us your specialties, certifications, and the locations you serve.' },
  { n: 2, title: 'Get verified',                body: 'We confirm your credentials and approve your profile within 48 hours.' },
  { n: 3, title: 'Show up in Find Partnas',     body: 'Active members and residents see your profile when they search at your locations.' },
  { n: 4, title: 'Take consultations',          body: 'Free consultation requests come in. You convert them on your own terms and pricing.' },
]

export default function TrainersPage() {
  return (
    <>
      <PublicNav />
      <PageShell>

        <section className="bg-[var(--color-primary)] text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-14">
            <span className="inline-block text-[11px] uppercase font-bold tracking-[0.18em] bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
              For trainers and coaches
            </span>
            <h1 className="mt-5 text-[34px] sm:text-[46px] font-extrabold leading-[1.05] tracking-tight max-w-3xl">
              Get discovered by people already in the door.
            </h1>
            <p className="mt-4 text-[16px] sm:text-[18px] text-white/90 leading-relaxed max-w-3xl">
              Trainers on WorkoutPartna show up next to active gym members and apartment residents who
              are already searching for someone to push them. No paid ads. No cold DMs. Free profiles during beta.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/app/signup?role=trainer"
                className="h-12 px-7 rounded-full bg-white text-[var(--color-primary)] inline-flex items-center font-bold text-[15px] shadow-lg"
              >
                Create Trainer Profile
              </Link>
              <Link
                href="#how"
                className="h-12 px-7 rounded-full border border-white/40 bg-white/10 backdrop-blur inline-flex items-center font-semibold text-[15px] text-white"
              >
                How it works
              </Link>
            </div>
          </div>
        </section>

        <Section>
          <Eyebrow>Why trainers join</Eyebrow>
          <H2>Get discovered locally. Convert on your own terms.</H2>
          <Lede>
            WorkoutPartna is a place where serious people show up to train. That's exactly the audience
            you want to be in front of.
          </Lede>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(b => (
              <div key={b.title} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
                <h3 className="font-bold text-[15px] text-[var(--color-foreground)]">{b.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-muted-foreground)]">{b.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <section id="how" className="bg-white border-y border-[var(--color-border)]">
          <Section>
            <Eyebrow>How it works</Eyebrow>
            <H2>From profile to first client, in four steps.</H2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(s => (
                <div key={s.n} className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5">
                  <span className="absolute -top-3 -left-3 h-9 w-9 rounded-full brand-gradient text-white font-extrabold text-[13px] flex items-center justify-center shadow-md">
                    {s.n}
                  </span>
                  <h3 className="mt-2 font-bold text-[15px] text-[var(--color-foreground)]">{s.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-muted-foreground)]">{s.body}</p>
                </div>
              ))}
            </div>
          </Section>
        </section>

        <Section>
          <div className="rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 p-7 text-center">
            <h3 className="font-extrabold text-[20px] text-[var(--color-foreground)]">
              Get Discovered Locally.
            </h3>
            <p className="mt-2 text-[14px] text-[var(--color-muted-foreground)] max-w-xl mx-auto">
              Free profiles during beta. We approve credentials within 48 hours.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 justify-center">
              <Link href="/app/signup?role=trainer" className="h-11 px-6 rounded-full brand-gradient text-white inline-flex items-center font-bold text-[14px] shadow-glow">
                Create Trainer Profile
              </Link>
              <Link href="/for-gyms-apartments#contact" className="h-11 px-6 rounded-full border border-[var(--color-border)] inline-flex items-center font-semibold text-[14px] text-[var(--color-foreground)]">
                Talk to our team
              </Link>
            </div>
          </div>
        </Section>

      </PageShell>
      <PublicFooter />
    </>
  )
}
