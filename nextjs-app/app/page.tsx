// WorkoutPartna, Marketing Homepage.
// Replaces the old SEO content site. Best content from the old version is
// folded into the FAQ section at the bottom for AI/Google citation density.
import Link from 'next/link'
import { PublicNav } from '../components/public/PublicNav'
import { PublicFooter } from '../components/public/PublicFooter'
import { PageShell, Section, Eyebrow, H2, Lede } from '../components/public/Section'
import { splashHero } from '../lib/photos'

export default function HomePage() {
  return (
    <>
      <PublicNav />
      <PageShell>

        {/* ─── 1. HERO ────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[var(--color-primary)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={splashHero} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
          {/* Combined overlay: dark base + brand color tint */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(15,23,80,0.82) 0%, rgba(30,99,233,0.75) 50%, rgba(124,58,237,0.68) 100%)',
            }}
          />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-20 sm:pb-28 text-white">
            <span className="inline-block text-[11px] uppercase font-bold tracking-[0.18em] bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
              Location-based fitness accountability
            </span>
            <h1 className="mt-5 text-[36px] sm:text-[56px] font-extrabold leading-[1.05] tracking-tight max-w-4xl">
              Find Your Workout Partna<br />
              <span className="text-white/90">Where You Already Train.</span>
            </h1>
            <p className="mt-5 text-[16px] sm:text-[19px] leading-relaxed text-white/90 max-w-2xl">
              WorkoutPartna connects gym members, apartment residents, and local fitness communities
              with real accountability partners based on location, goals, schedule, fitness level,
              and training style.
            </p>
            <p className="mt-3 text-[14px] sm:text-[15px] text-white/75 max-w-2xl">
              Not a dating app. Not just personal training. A real fitness connection platform for people
              who want to show up, stay consistent, and reach their goals together.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/app/signup"
                className="h-12 px-7 rounded-full bg-white text-[var(--color-primary)] inline-flex items-center font-bold text-[15px] shadow-lg hover:scale-[1.02] transition"
              >
                Find My Partna →
              </Link>
              <Link
                href="/for-gyms-apartments"
                className="h-12 px-7 rounded-full border border-white/40 bg-white/10 backdrop-blur inline-flex items-center font-semibold text-[15px] text-white hover:bg-white/20 transition"
              >
                Partner With Us
              </Link>
            </div>
          </div>
        </section>

        {/* ─── 2. FOUR PILLARS ────────────────────────────────────────────── */}
        <Section>
          <Eyebrow>What you get</Eyebrow>
          <H2>Four things every Partna gets, day one.</H2>
          <Lede>
            Built around real workouts at real locations, not endless swiping or generic AI plans.
          </Lede>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(p => (
              <div key={p.title} className="rounded-2xl border border-[var(--color-border)] bg-white p-5 hover:shadow-md transition">
                <div className="h-11 w-11 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                  {p.icon}
                </div>
                <h3 className="mt-4 font-bold text-[15px] text-[var(--color-foreground)]">{p.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-muted-foreground)]">{p.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── 3. HOW IT WORKS ────────────────────────────────────────────── */}
        <section className="bg-white border-y border-[var(--color-border)]">
          <Section>
            <Eyebrow>How it works</Eyebrow>
            <H2>How WorkoutPartna Works</H2>
            <Lede>From signup to your first session, in four steps.</Lede>
            <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 counter-reset-[step]">
              {steps.map((s, i) => (
                <li key={s.title} className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5">
                  <span className="absolute -top-3 -left-3 h-9 w-9 rounded-full brand-gradient text-white font-extrabold text-[13px] flex items-center justify-center shadow-md">
                    {i + 1}
                  </span>
                  <h3 className="mt-2 font-bold text-[15px] text-[var(--color-foreground)]">{s.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-muted-foreground)]">{s.body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <Link href="/how-it-works" className="text-[14px] font-semibold text-[var(--color-primary)]">
                See the full walkthrough →
              </Link>
            </div>
          </Section>
        </section>

        {/* ─── 4. WHO IT'S FOR ───────────────────────────────────────────── */}
        <Section>
          <Eyebrow>Built for real fitness communities</Eyebrow>
          <H2>One network. Four kinds of locations.</H2>
          <Lede>
            WorkoutPartna powers the gym you already train at, the fitness center in your apartment,
            the rec center down the street, and the trainer working in your area.
          </Lede>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map(a => (
              <div key={a.title} className="rounded-2xl bg-white border border-[var(--color-border)] p-5 hover:shadow-md transition">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ background: a.bg, color: a.fg }}>
                  {a.icon}
                </div>
                <h3 className="mt-4 font-bold text-[15px] text-[var(--color-foreground)]">{a.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-muted-foreground)]">{a.body}</p>
                <Link href={a.href} className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--color-primary)]">
                  {a.cta} →
                </Link>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── 5. LOCATION-BASED MATCHING (the differentiator) ──────────── */}
        <section className="bg-[var(--color-primary)] text-white">
          <Section>
            <div className="grid gap-10 md:grid-cols-2 items-center">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-[0.18em] text-white/70">Why we're different</span>
                <h2 className="mt-3 text-[28px] sm:text-[36px] font-extrabold leading-tight tracking-tight">
                  This works at your <span className="brand-gradient-text">exact</span> gym, apartment, or community.
                </h2>
                <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-white/85 max-w-xl">
                  Most fitness apps are generic. WorkoutPartna is location-first. Pick your spot,
                  and you only see Partnas who actually train there. No driving across town. No
                  ghost matches. Just people who'll be at the same place, at the same time, doing the
                  same kind of workout.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/app/signup"
                    className="h-11 px-6 rounded-full bg-white text-[var(--color-primary)] inline-flex items-center font-bold text-[14px]"
                  >
                    Find Partnas at My Gym
                  </Link>
                </div>
              </div>
              <ul className="grid gap-3">
                {scoringFactors.map(f => (
                  <li key={f.label} className="flex items-start gap-3 rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/15">
                    <span className="shrink-0 h-9 w-9 rounded-lg bg-white/15 text-white font-extrabold text-[13px] flex items-center justify-center">
                      +{f.points}
                    </span>
                    <div>
                      <p className="font-bold text-[14px]">{f.label}</p>
                      <p className="text-[12.5px] text-white/75">{f.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        </section>

        {/* ─── 6. ACCOUNTABILITY FEATURES ────────────────────────────────── */}
        <Section>
          <Eyebrow>Built for consistency</Eyebrow>
          <H2>Accountability that actually shows up.</H2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {accountability.map(a => (
              <div key={a.title} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
                <div className="text-2xl">{a.emoji}</div>
                <h3 className="mt-3 font-bold text-[15px] text-[var(--color-foreground)]">{a.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-muted-foreground)]">{a.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── 7. FOR APARTMENTS & GYMS (B2B teaser) ─────────────────────── */}
        <section className="bg-white border-y border-[var(--color-border)]">
          <Section>
            <div className="grid gap-10 md:grid-cols-2 items-center">
              <div>
                <Eyebrow>For apartment & gym operators</Eyebrow>
                <H2>Turn your fitness space into a real community.</H2>
                <Lede>
                  WorkoutPartna helps your members or residents find accountability partners,
                  join challenges, and use your fitness amenities more often. Modern engagement, lower churn.
                </Lede>
                <ul className="mt-6 grid gap-2.5 text-[14px] text-[var(--color-foreground)]">
                  {[
                    'Increase gym and amenity usage',
                    'Improve resident or member engagement',
                    'Build a stronger, branded community',
                    'Modern amenity differentiator for your property',
                    'Trainer and wellness staff visibility',
                  ].map(t => (
                    <li key={t} className="flex items-start gap-2">
                      <Check />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/for-gyms-apartments#contact"
                    className="h-11 px-6 rounded-full brand-gradient text-white inline-flex items-center font-bold text-[14px] shadow-glow"
                  >
                    Request a Demo
                  </Link>
                  <Link
                    href="/for-gyms-apartments"
                    className="h-11 px-6 rounded-full border border-[var(--color-border)] inline-flex items-center font-semibold text-[14px] text-[var(--color-foreground)]"
                  >
                    See partner pricing
                  </Link>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] p-6 bg-[var(--color-background)]">
                <div className="grid grid-cols-2 gap-3 text-center">
                  {b2bStats.map(s => (
                    <div key={s.label} className="rounded-xl bg-white p-4 border border-[var(--color-border)]">
                      <p className="text-[24px] sm:text-[28px] font-extrabold text-[var(--color-primary)]">{s.value}</p>
                      <p className="mt-0.5 text-[11.5px] uppercase tracking-wider font-semibold text-[var(--color-muted-foreground)]">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[11px] text-center text-[var(--color-muted-foreground)]">
                  Beta partner pricing may be adjusted for early gyms, apartments, and community partners.
                </p>
              </div>
            </div>
          </Section>
        </section>

        {/* ─── 8. FOR TRAINERS ───────────────────────────────────────────── */}
        <Section>
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-secondary)]">
                Free trainer profiles during beta
              </p>
              <p className="mt-2 text-[15px] text-[var(--color-foreground)] leading-relaxed">
                Get discovered by people already looking for fitness support in your local area. Offer free
                consultations, list specialties, and build a real local following.
              </p>
              <Link
                href="/trainers"
                className="mt-5 inline-flex items-center gap-1 text-[14px] font-bold text-[var(--color-primary)]"
              >
                See how trainers use WorkoutPartna →
              </Link>
            </div>
            <div>
              <Eyebrow>For trainers</Eyebrow>
              <H2>Get discovered by people already in the door.</H2>
              <Lede>
                Trainers on WorkoutPartna show up next to active gym members and apartment residents who
                are already searching for someone to push them. No paid ads. No cold DMs.
              </Lede>
              <Link
                href="/trainers"
                className="mt-6 h-11 px-6 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] inline-flex items-center font-bold text-[14px]"
              >
                Create Trainer Profile
              </Link>
            </div>
          </div>
        </Section>

        {/* ─── 9. SAFETY & VERIFICATION ──────────────────────────────────── */}
        <section className="bg-white border-y border-[var(--color-border)]">
          <Section>
            <div className="text-center max-w-3xl mx-auto">
              <Eyebrow>Safety first</Eyebrow>
              <H2 className="mx-auto">Built for real-world meetups, with safety in mind.</H2>
              <Lede>
                WorkoutPartna is for in-person fitness connections. Safety and trust are built in.
                Meet at public fitness locations, control your profile, and report anything that
                doesn't feel right.
              </Lede>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
              {safetyFeatures.map(s => (
                <div key={s} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 flex items-start gap-2.5">
                  <Check />
                  <span className="text-[13.5px] font-medium text-[var(--color-foreground)]">{s}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/safety" className="text-[14px] font-bold text-[var(--color-primary)]">
                Read the full Safety Guide →
              </Link>
            </div>
          </Section>
        </section>

        {/* ─── 10. FAQ (folds in old SEO content) ───────────────────────── */}
        <Section>
          <Eyebrow>Frequently asked</Eyebrow>
          <H2>Questions, answered.</H2>
          <div className="mt-10 grid gap-3 max-w-3xl">
            {faqs.map(f => (
              <details key={f.q} className="group rounded-2xl border border-[var(--color-border)] bg-white p-5">
                <summary className="cursor-pointer list-none font-bold text-[15px] text-[var(--color-foreground)] flex items-center justify-between">
                  {f.q}
                  <span className="text-[var(--color-primary)] group-open:rotate-45 transition text-2xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-muted-foreground)]">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>

        {/* ─── 11. FINAL CTA ─────────────────────────────────────────────── */}
        <section className="brand-gradient text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 text-center">
            <h2 className="text-[28px] sm:text-[36px] font-extrabold leading-tight tracking-tight">
              Ready to find your Partna?
            </h2>
            <p className="mt-3 text-[15px] sm:text-[17px] text-white/90 max-w-xl mx-auto">
              Free to sign up. No subscription required to find a partner. Just real workouts at real gyms.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Link
                href="/app/signup"
                className="h-12 px-8 rounded-full bg-white text-[var(--color-primary)] inline-flex items-center font-bold text-[15px] shadow-lg"
              >
                Find My Partna
              </Link>
              <Link
                href="/for-gyms-apartments"
                className="h-12 px-8 rounded-full border border-white/40 bg-white/10 backdrop-blur inline-flex items-center font-semibold text-[15px] text-white"
              >
                Partner With Us
              </Link>
            </div>
          </div>
        </section>

      </PageShell>
      <PublicFooter />
    </>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────

function Check() {
  return (
    <span className="shrink-0 mt-0.5 h-5 w-5 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] flex items-center justify-center">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5L20 6" />
      </svg>
    </span>
  )
}

const pillars = [
  {
    title: 'Location-Based Matching',
    body: 'See Partnas at your exact gym, apartment fitness center, or community space. Filter by distance, schedule, and goals.',
    icon: <Pin />,
  },
  {
    title: 'Real Gym Communities',
    body: 'Join the community at your location. See who\'s training today, who\'s in your weekly challenge, who shows up.',
    icon: <Users />,
  },
  {
    title: 'Smart Partner Filters',
    body: 'Match by goals, schedule overlap, fitness level, workout style, and accountability vibe. Not just photos.',
    icon: <Sliders />,
  },
  {
    title: 'Daily Accountability',
    body: 'Workout invites, daily check-ins, streaks, and challenges that keep you and your Partna showing up.',
    icon: <Check2 />,
  },
]

const steps = [
  { title: 'Choose Your Location', body: 'Select your gym, apartment fitness center, community center, or local fitness facility.' },
  { title: 'Build Your Fitness Profile', body: 'Add your goals, schedule, fitness level, workout style, and accountability preferences.' },
  { title: 'Match With Compatible Partnas', body: 'Find people who train where you train and want the same kind of consistency.' },
  { title: 'Message and Plan Workouts', body: 'Connect, chat, schedule sessions, join challenges, and stay accountable.' },
]

const audiences = [
  {
    title: 'For Gym Members',
    body: 'Stop training alone. Find someone at your same gym who shares your goals, schedule, and workout style.',
    cta: 'Get started',
    href: '/app/signup',
    bg: 'rgba(30,99,233,0.10)', fg: 'hsl(216 82% 52%)',
    icon: <Users />,
  },
  {
    title: 'For Apartment Residents',
    body: 'Turn the apartment fitness center into a real community where residents meet, train, and stay accountable.',
    cta: 'See how it works',
    href: '/how-it-works',
    bg: 'rgba(34,211,238,0.18)', fg: 'hsl(188 84% 35%)',
    icon: <Building />,
  },
  {
    title: 'For Gyms & Fitness Centers',
    body: 'Help members connect, increase engagement, improve retention, and create a stronger fitness community.',
    cta: 'Partner with us',
    href: '/for-gyms-apartments',
    bg: 'rgba(124,58,237,0.12)', fg: 'hsl(262 83% 58%)',
    icon: <Dumbbell />,
  },
  {
    title: 'For Trainers',
    body: 'Get discovered by people already looking for fitness support. Offer consultations and accountability sessions.',
    cta: 'Become a trainer',
    href: '/trainers',
    bg: 'rgba(53,184,115,0.15)', fg: 'hsl(148 55% 35%)',
    icon: <Whistle />,
  },
]

const scoringFactors = [
  { points: 40, label: 'Same location',    body: 'You both train at the exact same gym, apartment, or community space.' },
  { points: 25, label: 'Schedule overlap', body: 'Your workout days and times line up.' },
  { points: 15, label: 'Shared goal',      body: 'Build muscle, lose weight, get stronger, stay consistent.' },
  { points: 10, label: 'Fitness level',    body: 'Beginner-friendly to athlete, matched up.' },
  { points: 10, label: 'Workout style',    body: 'Strength, HIIT, run, yoga, calisthenics.' },
]

const accountability = [
  { emoji: '📅', title: 'Workout invites',  body: 'Schedule a session with your Partna. They get a confirmation, you both check in.' },
  { emoji: '🔥', title: 'Streaks & check-ins', body: 'Daily and weekly streaks. Miss a day, your Partna sees it. Show up, you both win.' },
  { emoji: '🏆', title: 'Local challenges',   body: 'Join challenges at your location. Compete with neighbors, win bragging rights.' },
]

const b2bStats = [
  { value: '$99', label: 'Starter / month' },
  { value: '$199', label: 'Growth / month' },
  { value: 'Custom', label: 'Network partner' },
  { value: '7 days', label: 'Free trial' },
]

const safetyFeatures = [
  'Public fitness locations only',
  'Block and report any user',
  'Verified location membership',
  'No home address sharing',
  'Profile visibility controls',
  'Trainer verification fields',
  'Safety reminders before meeting',
  'Community rules enforced',
]

const faqs = [
  {
    q: 'Is WorkoutPartna a dating app?',
    a: 'No. WorkoutPartna is a fitness accountability platform. The whole experience is built around finding someone who will actually show up at your gym, apartment fitness center, or community fitness space, and train with you. People with different intent are filtered out.',
  },
  {
    q: 'Is WorkoutPartna free to use?',
    a: 'Yes. Creating a profile, picking your location, and matching with workout Partnas is free. We have a $9.99/month optional Daily Coach add-on for AI workout suggestions and expanded filters, but it is not required to find a partner.',
  },
  {
    q: 'Where does WorkoutPartna work?',
    a: 'WorkoutPartna is launching in the Houston, Texas area, including Cypress, Katy, Spring, The Woodlands, Sugar Land, Pearland, and Humble. Apartment communities and gyms outside Houston can request to be added as partner locations.',
  },
  {
    q: 'Can I find Partnas at my apartment gym?',
    a: 'Yes. Apartment fitness centers, HOA fitness rooms, and community gyms are first-class locations on WorkoutPartna. Match with neighbors who share your gym, schedule, and goals.',
  },
  {
    q: 'How does WorkoutPartna match me with a Partna?',
    a: 'A simple compatibility score: same location is worth 40 points, schedule overlap 25, shared goal 15, similar fitness level 10, shared workout style 10. You see the score on every card with badges that explain why.',
  },
  {
    q: 'Does WorkoutPartna help me find personal trainers?',
    a: 'Trainers can list profiles on WorkoutPartna and offer free consultations. We are a partner platform, not a marketplace. The core experience is connecting peers, with trainers as a supporting layer.',
  },
  {
    q: 'How is WorkoutPartna different from other fitness apps?',
    a: 'Most fitness apps focus on tracking workouts, nutrition, or trainer booking. WorkoutPartna is built around real people meeting at real fitness locations to hold each other accountable. The location is the unit, not the workout.',
  },
  {
    q: 'How do I bring WorkoutPartna to my gym or apartment?',
    a: 'Visit /for-gyms-apartments and request a partnership. Beta pricing is $99/month for small locations and $199/month for larger gyms or apartment communities, with custom plans for property management groups and multi-location operators.',
  },
]

// ─── Inline icons ───────────────────────────────────────────────────────────
function Pin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}
function Users() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" /><path d="M3 21a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.6" /><path d="M14 21a5 5 0 0 1 9 0" opacity="0.7" />
    </svg>
  )
}
function Sliders() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="9" cy="6" r="2" fill="currentColor" /><circle cx="14" cy="12" r="2" fill="currentColor" /><circle cx="7" cy="18" r="2" fill="currentColor" />
    </svg>
  )
}
function Check2() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 6" />
    </svg>
  )
}
function Building() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" />
    </svg>
  )
}
function Dumbbell() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12" />
    </svg>
  )
}
function Whistle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="14" r="6" />
      <path d="M14 12l7-3v6l-7-3M14 9V6h-2" />
    </svg>
  )
}
