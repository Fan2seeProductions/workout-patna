// /safety — medical and training safety for the AI Coach product.
// Replaces the old in-person-meetup safety page (irrelevant now that
// WorkoutPartna is a single-purpose AI trainer, not a matching app).
import Link from 'next/link'
import type { Metadata } from 'next'
import { PublicNav } from '../../components/public/PublicNav'
import { PublicFooter } from '../../components/public/PublicFooter'
import { PageShell, Section, Eyebrow, H2, Lede } from '../../components/public/Section'

export const metadata: Metadata = {
  title: 'Safety | WorkoutPartna',
  description:
    'WorkoutPartna is a general-fitness AI trainer, not a clinician. Here is exactly what we will and will not do, when to stop and call a doctor, and how we handle your data.',
}

const guardrails = [
  {
    title: 'We do not diagnose or treat medical conditions',
    body: 'We are not a doctor, PT, dietitian, or emergency service. We do not interpret symptoms, prescribe medication, or replace clinical care.',
  },
  {
    title: 'Red-flag symptoms stop your workout',
    body: 'If you report chest pain, fainting, severe shortness of breath, sudden injury, neurological symptoms, dangerous pain, or pregnancy complications, the AI stops generating training and tells you to seek medical care.',
  },
  {
    title: 'Plans default to the smallest effective workout',
    body: 'When sleep, soreness, stress, or recovery are poor, the AI prefers shorter recovery sessions, mobility work, or zone-2 cardio over heavy training. Progress only when readiness supports it.',
  },
  {
    title: 'Equipment + injury constraints are respected',
    body: 'Workouts only use what you say you have. Injuries and limitations you list never appear in your plan unless the movement is explicitly safe for them.',
  },
  {
    title: 'No shame, no fixed schedule',
    body: 'Missed days do not trigger penalties or guilt language. We restart cleanly. Reply SKIP and tomorrow we reset.',
  },
  {
    title: 'You can stop anytime',
    body: 'Reply STOP to opt out of all texts. Cancel your subscription in one tap. We will not retain you with dark patterns.',
  },
]

const before = [
  'You have a heart condition or have had a cardiac event',
  'You feel chest discomfort during physical activity',
  'You experience dizziness, fainting, or balance problems',
  'You have a bone or joint problem that could be worsened by activity',
  'You are pregnant or recently postpartum',
  'You are recovering from surgery, illness, or injury',
  'You take medication for blood pressure, heart, or seizure conditions',
  'You have any other medical reason to be cautious about exercise',
]

const stopAndCall = [
  'Chest pain, pressure, or tightness',
  'Severe shortness of breath beyond normal training discomfort',
  'Dizziness, fainting, or sudden confusion',
  'Sudden severe headache or vision change',
  'Numbness or weakness in an arm, leg, or face',
  'A sudden sharp injury, popping sensation, or inability to bear weight',
  'Any symptom that feels wrong or unfamiliar to you',
]

export default function SafetyPage() {
  return (
    <>
      <PublicNav />
      <PageShell>

        <section className="bg-[var(--color-primary)] text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-14">
            <span className="inline-block text-[11px] uppercase font-bold tracking-[0.18em] bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
              Safety
            </span>
            <h1 className="mt-5 text-[34px] sm:text-[46px] font-extrabold leading-[1.05] tracking-tight max-w-3xl">
              An AI trainer for general fitness. Not a clinician.
            </h1>
            <p className="mt-4 text-[16px] sm:text-[18px] text-white/90 leading-relaxed max-w-3xl">
              This page tells you exactly what WorkoutPartna will and will not do, when to stop and call a doctor, and how we handle your data. Read it before you start training.
            </p>
          </div>
        </section>

        <Section>
          <Eyebrow>What we will and will not do</Eyebrow>
          <H2>Our safety guardrails.</H2>
          <Lede>
            The product is designed around these rules. They are baked into the AI prompt, not just policy on a page.
          </Lede>

          <div className="mt-8 grid gap-4 md:grid-cols-2 max-w-4xl">
            {guardrails.map(g => (
              <div key={g.title} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
                <h3 className="text-[15px] font-extrabold text-[var(--color-foreground)] mb-2">{g.title}</h3>
                <p className="text-[13.5px] text-[var(--color-muted-foreground)] leading-relaxed">{g.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <section className="bg-white border-y border-[var(--color-border)]">
          <Section>
            <Eyebrow>Talk to a clinician first if…</Eyebrow>
            <H2>Get medical clearance before starting.</H2>
            <Lede>
              Most healthy adults can safely begin moderate exercise without seeing a doctor first. If any of these apply to you, talk to a healthcare professional before starting training — with us or anyone.
            </Lede>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2 max-w-3xl">
              {before.map(b => (
                <li key={b} className="flex items-start gap-2 text-[14px] text-[var(--color-foreground)]">
                  <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[13px] text-[var(--color-muted-foreground)] max-w-3xl">
              When in doubt, get cleared. The American Heart Association notes that healthy adults generally do not need a clinician&apos;s clearance to begin moderate activity, but adults with chronic or other conditions should consult a health professional about whether regular activity is appropriate.
            </p>
          </Section>
        </section>

        <Section>
          <Eyebrow>If this happens, stop immediately</Eyebrow>
          <H2>Stop the workout and call for help.</H2>
          <Lede>
            Training discomfort is normal. These signs are not. Stop, sit down, and seek medical attention.
          </Lede>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2 max-w-3xl">
            {stopAndCall.map(s => (
              <li key={s} className="flex items-start gap-2 text-[14px] text-[var(--color-foreground)]">
                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)]" />
                <span>{s}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border-2 border-[var(--color-secondary)]/30 bg-[var(--color-secondary)]/5 p-5 max-w-3xl">
            <p className="text-[13.5px] text-[var(--color-foreground)] leading-relaxed">
              <strong>If you are having an emergency, call 911 (or your local emergency number) immediately.</strong> Do not wait, do not text us first, do not finish the workout.
            </p>
          </div>
        </Section>

        <section className="bg-white border-y border-[var(--color-border)]">
          <Section>
            <Eyebrow>Privacy and data</Eyebrow>
            <H2>How we handle what you share.</H2>
            <Lede>
              We collect only what we need to personalize your training and send your messages.
            </Lede>

            <div className="mt-6 grid gap-4 md:grid-cols-2 max-w-4xl">
              {[
                { t: 'Encrypted in transit and at rest', b: 'TLS in transit, encrypted database and backups.' },
                { t: 'Server-side secrets only', b: 'AI and SMS provider keys never leave our servers and are not exposed to the client.' },
                { t: 'Least-privilege access', b: 'Admin tools and customer support see only what is needed to help you.' },
                { t: 'You can delete your account', b: 'One request and we remove your personal data. Some records (billing, consent timestamps) are retained as required by law.' },
              ].map(x => (
                <div key={x.t} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5">
                  <h3 className="text-[15px] font-extrabold text-[var(--color-foreground)] mb-2">{x.t}</h3>
                  <p className="text-[13px] text-[var(--color-muted-foreground)] leading-relaxed">{x.b}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-[13px] text-[var(--color-muted-foreground)] max-w-3xl">
              For the full details, see our <Link href="/privacy" className="text-[var(--color-primary)] font-semibold underline">Privacy Policy</Link>, <Link href="/terms" className="text-[var(--color-primary)] font-semibold underline">Terms</Link>, and <Link href="/waiver" className="text-[var(--color-primary)] font-semibold underline">Health &amp; Liability Acknowledgment</Link>.
            </p>
          </Section>
        </section>

        <Section>
          <Eyebrow>Questions?</Eyebrow>
          <H2>Reach out anytime.</H2>
          <Lede>
            Safety concerns, medical questions about whether the product is right for you, or anything else — we read every email.
          </Lede>
          <p className="mt-4">
            <a href="mailto:sales@fan2seeproductions.com?subject=WorkoutPartna%20safety%20question" className="inline-flex h-12 px-7 rounded-full brand-gradient text-white items-center font-bold text-[14px] shadow-glow">
              Email us →
            </a>
          </p>
        </Section>

      </PageShell>
      <PublicFooter />
    </>
  )
}
