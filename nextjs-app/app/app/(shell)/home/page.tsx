// Home dashboard. First screen after sign-in.
// Layout matches the WorkoutPartna app flyer.
import Link from 'next/link'
import type { Metadata } from 'next'
import { Logo } from '../../../../components/app/Logo'
import {
  StrengthIcon, RunIcon, FlameIcon, YogaIcon, HeartPulseIcon,
  ScaleIcon, LegIcon, ArmIcon, TargetIcon,
  BellIcon, ChatIcon, BrainIcon, ArrowRightIcon, SparkleIcon,
} from '../../../../components/app/icons'
import { matchPhotos } from '../../../../lib/photos'

export const metadata: Metadata = {
  title: 'Home',
  robots: { index: false, follow: false },
}

const topMatches = [
  { id: 'marcus',  name: 'Marcus', age: 28, score: 93, photo: matchPhotos.marcus,  status: 'now',     focus: 'Strength' },
  { id: 'jasmine', name: 'Jasmine', age: 27, score: 92, photo: matchPhotos.jasmine, status: 'evening', focus: 'Yoga' },
  { id: 'priya',   name: 'Priya',  age: 26, score: 90, photo: matchPhotos.priya,   status: 'morning', focus: 'HIIT' },
  { id: 'ethan',   name: 'Ethan',  age: 31, score: 88, photo: matchPhotos.ethan,   status: 'weekends', focus: 'Run' },
]

const activities = [
  { name: 'Strength',    Icon: StrengthIcon },
  { name: 'Run Club',    Icon: RunIcon },
  { name: 'HIIT',        Icon: FlameIcon },
  { name: 'Yoga',        Icon: YogaIcon },
  { name: 'Cardio',      Icon: HeartPulseIcon },
  { name: 'Weight Loss', Icon: ScaleIcon },
  { name: 'Legs',        Icon: LegIcon },
  { name: 'Upper Body',  Icon: ArmIcon },
  { name: 'Abs / Core',  Icon: TargetIcon },
]

export default function HomePage() {
  return (
    <main className="mx-auto max-w-md px-5 pt-3 pb-2">
      {/* Top bar */}
      <header className="flex items-center justify-between py-3">
        <Logo size={28} withWordmark />
        <div className="flex items-center gap-2">
          <IconButton aria-label="Notifications" badge>
            <BellIcon width={18} height={18} />
          </IconButton>
          <IconButton aria-label="Messages">
            <ChatIcon width={18} height={18} />
          </IconButton>
        </div>
      </header>

      {/* Hero block */}
      <section className="mt-1">
        <h1 className="text-[28px] font-extrabold leading-[1.1] tracking-tight">
          Find. Connect.
          <br />
          <span className="brand-gradient-text">Get Stronger.</span>
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          5 new matches near your gym today.
        </p>
      </section>

      {/* Top matches: 4 thin portrait cards in a row */}
      <Section title="Top matches for you" href="/app/discover">
        <div className="grid grid-cols-4 gap-2">
          {topMatches.map(m => (
            <Link
              href={`/app/profile/${m.id}`}
              key={m.id}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] hover:border-[var(--color-border-bright)] transition"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.photo}
                alt={m.name}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/85" />

              <span className="absolute top-1.5 left-1.5 rounded-full bg-[var(--color-match)]/90 px-1.5 py-0.5 text-[9px] font-bold text-black backdrop-blur">
                {m.score}%
              </span>

              <div className="absolute inset-x-0 bottom-0 p-2">
                <p className="text-[11px] font-bold leading-tight truncate">
                  {m.name}, {m.age}
                </p>
                <p className="text-[10px] text-white/65 leading-tight truncate">
                  {m.focus}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Explore by activity */}
      <Section title="Explore by activity">
        <div className="grid grid-cols-3 gap-2.5">
          {activities.map(({ name, Icon }) => (
            <Link
              href={`/app/discover?activity=${encodeURIComponent(name)}`}
              key={name}
              className="glass-card flex flex-col items-center justify-center gap-1.5 py-4 hover:border-[var(--color-border-bright)] transition"
            >
              <Icon className="text-[var(--color-brand-bright)]" width={22} height={22} />
              <span className="text-[11px] font-medium text-white/85 text-center leading-tight">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* AI Daily Coach */}
      <Section>
        <Link href="/app/coach" className="block glass-card relative overflow-hidden p-4 hover:border-[var(--color-border-bright)] transition">
          <div
            aria-hidden
            className="absolute inset-0 opacity-50"
            style={{
              background:
                'radial-gradient(ellipse at top right, rgba(6,182,212,0.18), transparent 60%)',
            }}
          />
          <div className="relative flex items-start gap-3">
            <div className="shrink-0 h-11 w-11 rounded-xl bg-[var(--color-cyan)]/15 border border-[var(--color-cyan)]/30 flex items-center justify-center text-[var(--color-cyan)]">
              <BrainIcon width={22} height={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[15px]">AI Daily Coach</h3>
                <span className="rounded-md bg-[var(--color-cyan)]/15 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[var(--color-cyan)]">
                  New
                </span>
              </div>
              <p className="mt-0.5 text-[13px] text-[var(--color-text-muted)] leading-snug">
                Get your custom daily workout plan via text.
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-brand-bright)]">
                Get Started <ArrowRightIcon width={14} height={14} />
              </span>
            </div>
          </div>
        </Link>
      </Section>

      {/* Challenge preview */}
      <Section title="Challenge preview" href="/app/challenges">
        <Link href="/app/challenges" className="block glass-card p-3 flex items-center gap-3 hover:border-[var(--color-border-bright)] transition">
          <ProgressRing pct={60} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <SparkleIcon className="text-[var(--color-brand-bright)]" width={14} height={14} />
              <p className="font-bold text-[14px] truncate">10K Steps Challenge</p>
            </div>
            <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
              5 days left · 1,245 joined
            </p>
            <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full brand-gradient" style={{ width: '60%' }} />
            </div>
          </div>
        </Link>
      </Section>
    </main>
  )
}

function Section({
  title, href, children,
}: { title?: string; href?: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      {title && (
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-[14px] font-bold tracking-tight">{title}</h2>
          {href && (
            <Link href={href} className="text-[11px] font-semibold text-[var(--color-brand-bright)] inline-flex items-center gap-0.5">
              See all
            </Link>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

function IconButton({
  children, badge, ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { badge?: boolean }) {
  return (
    <button
      {...rest}
      className="relative h-9 w-9 rounded-full border border-[var(--color-border)] bg-white/[0.03] flex items-center justify-center text-white/85 hover:bg-white/[0.07] transition"
    >
      {children}
      {badge && (
        <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-danger)]" />
      )}
    </button>
  )
}

function ProgressRing({ pct }: { pct: number }) {
  const r = 19
  const c = 2 * Math.PI * r
  const dash = (pct / 100) * c
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="shrink-0">
      <defs>
        <linearGradient id="ring-grad" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r={r} stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
      <circle
        cx="24" cy="24" r={r}
        stroke="url(#ring-grad)" strokeWidth="4" strokeLinecap="round" fill="none"
        strokeDasharray={`${dash} ${c}`}
        transform="rotate(-90 24 24)"
      />
      <text x="24" y="28" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
        {pct}%
      </text>
    </svg>
  )
}
