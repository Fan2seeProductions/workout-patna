// /safety — public safety guide.
import Link from 'next/link'
import type { Metadata } from 'next'
import { PublicNav } from '../../components/public/PublicNav'
import { PublicFooter } from '../../components/public/PublicFooter'
import { PageShell, Section, Eyebrow, H2, Lede } from '../../components/public/Section'

export const metadata: Metadata = {
  title: 'Safety & Trust | WorkoutPartna',
  description:
    'WorkoutPartna is built for real-world fitness connections, so safety and trust matter. Public locations only, blocking, reporting, verified locations, and clear community rules.',
}

const features = [
  { title: 'Public fitness locations only', body: 'You only meet at public gyms, apartment fitness centers, or community fitness spaces. We do not support meeting at homes.' },
  { title: 'Block any user',                body: 'Block someone with one tap. They will not see your profile or be able to message you.' },
  { title: 'Report any user',               body: 'Report inappropriate behavior. Our team reviews every report. Confirmed violations result in account removal.' },
  { title: 'Verified location membership',  body: 'Optional verification that you actually train at the location you claim. Boosts trust and visibility.' },
  { title: 'No home address sharing',       body: 'Profiles are tied to fitness locations, not addresses. We never display home addresses.' },
  { title: 'Profile visibility controls',   body: 'Choose who can see your profile: everyone in your gym, only matches, or hidden until you initiate.' },
  { title: 'Trainer verification fields',   body: 'Trainers list certifications and credentials. We approve them before they appear in search.' },
  { title: 'Safety reminders before meeting', body: 'Before your first session, we surface tips: meet during staffed hours, tell someone your plan, and trust your gut.' },
]

const rules = [
  'Be respectful. No harassment, hate speech, or unwanted advances.',
  'No solicitation, MLM pitches, or unrelated business outreach.',
  'No solicitation of personal information beyond what someone shares publicly.',
  'No fake profiles or impersonation.',
  'No photos of minors.',
  'Trainers must list real credentials.',
  'Locations must be real public fitness facilities.',
]

export default function SafetyPage() {
  return (
    <>
      <PublicNav />
      <PageShell>

        <section className="bg-[var(--color-primary)] text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-14">
            <span className="inline-block text-[11px] uppercase font-bold tracking-[0.18em] bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
              Safety & trust
            </span>
            <h1 className="mt-5 text-[34px] sm:text-[46px] font-extrabold leading-[1.05] tracking-tight max-w-3xl">
              Built for real meetups, with safety in mind.
            </h1>
            <p className="mt-4 text-[16px] sm:text-[18px] text-white/90 leading-relaxed max-w-3xl">
              WorkoutPartna is for in-person fitness connections. Safety and trust are built in.
              Meet at public fitness locations, control your profile, and report anything that
              doesn't feel right.
            </p>
          </div>
        </section>

        <Section>
          <Eyebrow>Built-in safety features</Eyebrow>
          <H2>Real safety tools, on every profile.</H2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {features.map(f => (
              <div key={f.title} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
                <h3 className="font-bold text-[15px] text-[var(--color-foreground)]">{f.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-muted-foreground)]">{f.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <section className="bg-white border-y border-[var(--color-border)]">
          <Section>
            <Eyebrow>Community rules</Eyebrow>
            <H2>What WorkoutPartna is not for.</H2>
            <Lede>
              WorkoutPartna is a fitness accountability platform. We enforce these rules across every
              location and every account.
            </Lede>
            <ul className="mt-8 space-y-2 max-w-3xl">
              {rules.map(r => (
                <li key={r} className="flex items-start gap-2.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] px-4 py-3">
                  <span className="shrink-0 mt-0.5 text-[var(--color-destructive)]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                  <span className="text-[14px] text-[var(--color-foreground)]">{r}</span>
                </li>
              ))}
            </ul>
          </Section>
        </section>

        <Section>
          <div className="rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 p-7 text-center">
            <h3 className="font-extrabold text-[20px] text-[var(--color-foreground)]">
              Need to report something?
            </h3>
            <p className="mt-2 text-[14px] text-[var(--color-muted-foreground)] max-w-xl mx-auto">
              Reach out and we'll review within 24 hours. Anything dangerous is escalated immediately.
            </p>
            <a
              href="mailto:sales@fan2seeproductions.com?subject=WorkoutPartna%20Safety%20Concern"
              className="mt-5 inline-flex h-11 px-6 rounded-full brand-gradient text-white items-center font-bold text-[14px] shadow-glow"
            >
              sales@fan2seeproductions.com
            </a>
          </div>
        </Section>

      </PageShell>
      <PublicFooter />
    </>
  )
}
