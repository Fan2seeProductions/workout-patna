// Home dashboard — cinematic social-app layout.
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '../../../../lib/supabase/server'
import { matchScore } from '../../../../lib/matching'

export const metadata: Metadata = {
  title: 'Home',
  robots: { index: false, follow: false },
}

type ProfileLite = {
  id: string
  display_name: string | null
  age: number | null
  fitness_level: string | null
  goals: string[] | null
  styles: string[] | null
  primary_location: string | null
  gym_id: string | null
  schedule_days: string[] | null
  schedule_times: string[] | null
  photo_url: string | null
  streak_count?: number | null
}

function firstName(s: string | null | undefined) {
  if (!s) return 'there'
  return s.split(' ')[0]
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function dayLabel() {
  return new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [meRes, othersRes, matchesRes, messagesRes, trainingRes] = await Promise.all([
    user
      ? supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from('profiles')
      .select('id, display_name, age, fitness_level, goals, styles, primary_location, gym_id, schedule_days, schedule_times, photo_url')
      .neq('id', user?.id ?? '00000000-0000-0000-0000-000000000000')
      .limit(30),
    user
      ? supabase.from('matches').select('id').eq('status', 'active').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      : Promise.resolve({ data: [] }),
    user
      ? supabase.from('messages').select('id').eq('read_at', null).neq('sender_id', user.id)
      : Promise.resolve({ data: [] }),
    user
      ? supabase.from('training_today').select('id, workout_type, starts_at, gym_id, gyms(name)').eq('status', 'open').order('starts_at').limit(5)
      : Promise.resolve({ data: [] }),
  ])

  const me = (meRes.data ?? null) as ProfileLite | null
  const others = (othersRes.data ?? []) as ProfileLite[]
  const activeMatches = (matchesRes.data ?? []).length
  const unreadCount = (messagesRes.data ?? []).length
  const trainingToday = (trainingRes.data ?? []) as any[]

  const suggested = others
    .map(p => ({ ...p, score: me ? (matchScore(me as any, p as any) ?? 60) : 70 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  const displayName = me?.display_name ?? user?.email?.split('@')[0] ?? ''
  const streakCount = me?.streak_count ?? null

  return (
    <div className="min-h-dvh bg-[#0d0d0d] pb-28">

      {/* ── HERO HEADER ── */}
      <header className="relative px-5 pt-14 pb-6 overflow-hidden" style={{ minHeight: '180px' }}>
        {/* subtle red glow behind greeting */}
        <div
          className="pointer-events-none absolute -top-10 -left-10 w-64 h-64 rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #dc1616 0%, transparent 70%)' }}
        />

        {/* Top row: wordmark + actions */}
        <div className="flex items-center justify-between mb-5">
          <span className="font-display text-[13px] font-extrabold tracking-widest uppercase text-[var(--color-primary)]">
            WorkoutPartna
          </span>
          <div className="flex items-center gap-2.5">
            {/* Notification bell */}
            <Link href="/app/messages" className="relative h-9 w-9 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[var(--color-primary)] text-white text-[9px] font-extrabold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            {/* Avatar */}
            <Link href="/app/profile">
              {me?.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={me.photo_url}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-[var(--color-primary)]/40"
                />
              ) : (
                <div className="h-9 w-9 rounded-full brand-gradient flex items-center justify-center text-white font-extrabold text-[14px]">
                  {(firstName(displayName)[0] ?? '?').toUpperCase()}
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Big greeting */}
        <p className="font-display text-[30px] font-extrabold leading-none text-white tracking-tight">
          {greeting()},<br />
          <span className="text-[var(--color-primary)]">{firstName(displayName)}</span>
        </p>

        {/* Day + streak subtitle */}
        <p className="mt-2 text-[13px] text-white/50 font-medium">
          {dayLabel()}
          {streakCount && streakCount > 1 ? (
            <span className="ml-2 inline-flex items-center gap-1 text-orange-400 font-bold">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
              </svg>
              {streakCount}-day streak
            </span>
          ) : null}
        </p>

        {/* Thin red accent line */}
        <div className="mt-4 h-[2px] w-12 rounded-full bg-[var(--color-primary)]" />
      </header>

      {/* ── QUICK ACTIONS STRIP ── */}
      <div className="px-5 mb-6">
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
          <QuickAction href="/app/discover" label="Find Partnas">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </QuickAction>
          <QuickAction href="/app/messages" label="Messages" badge={unreadCount > 0 ? unreadCount : undefined}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </QuickAction>
          <QuickAction href="/app/challenges" label="Challenges">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
            </svg>
          </QuickAction>
          <QuickAction href="/app/coach" label="AI Coach">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
            </svg>
          </QuickAction>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="px-5 mb-5 grid grid-cols-3 gap-2.5">
        <StatChip label="Matches" value={activeMatches} href="/app/matches" />
        <StatChip label="Unread" value={unreadCount} href="/app/messages" badge />
        <StatChip
          label="Streak"
          value={streakCount ?? null}
          href="/app/profile"
          displayValue={streakCount && streakCount > 0 ? `${streakCount}d` : '—'}
        />
      </div>

      {/* ── NO-LOCATION NUDGE ── */}
      {!me?.primary_location && (
        <div className="mx-5 mb-5 rounded-2xl bg-white/[0.04] border border-white/10 p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-primary)]">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-extrabold text-white leading-tight">Set your gym</p>
            <p className="text-[11px] text-white/50 mt-0.5">Match with people who train where you do.</p>
          </div>
          <Link
            href="/app/onboarding/find-location"
            className="shrink-0 h-8 px-4 rounded-full brand-gradient text-white font-extrabold text-[11px] flex items-center"
          >
            Find
          </Link>
        </div>
      )}

      {/* ── TRAINING TODAY AT YOUR GYM ── */}
      {trainingToday.length > 0 && (
        <section className="mb-7">
          <div className="px-5 flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-extrabold text-white font-display">Training today at your gym</h2>
            <Link href="/app/discover?tab=training" className="text-[12px] font-bold text-[var(--color-primary)]">See all</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-5">
            {trainingToday.map((t: any) => (
              <div
                key={t.id}
                className="shrink-0 w-[150px] rounded-2xl bg-white/[0.04] border border-white/10 p-3.5"
              >
                {/* Avatar initial */}
                <div className="h-9 w-9 rounded-full brand-gradient flex items-center justify-center text-white font-extrabold text-[14px] mb-2.5">
                  {(t.workout_type?.[0] ?? 'T').toUpperCase()}
                </div>
                <p className="text-[13px] font-extrabold text-white truncate">{t.workout_type ?? 'Training'}</p>
                <p className="text-[11px] text-white/50 mt-0.5 truncate">{t.gyms?.name ?? 'Your gym'}</p>
                {t.starts_at && (
                  <p className="text-[11px] font-bold text-[var(--color-primary)] mt-1.5">
                    {new Date(t.starts_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SUGGESTED PARTNAS — tall photo cards ── */}
      <section className="mb-7">
        <div className="px-5 flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-extrabold text-white font-display">Suggested Partnas</h2>
          <Link href="/app/discover" className="text-[12px] font-bold text-[var(--color-primary)]">See all</Link>
        </div>

        {suggested.length === 0 ? (
          <div className="mx-5 rounded-2xl border border-dashed border-white/10 p-6 text-center">
            <p className="text-[14px] font-bold text-white">No suggestions yet</p>
            <p className="text-[12px] text-white/50 mt-1">Complete your profile to see compatible partnas.</p>
            <Link
              href="/app/onboarding"
              className="mt-3 inline-flex h-9 px-5 rounded-full brand-gradient text-white items-center font-bold text-[12px]"
            >
              Complete Profile
            </Link>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-5">
            {suggested.map(p => (
              <Link
                key={p.id}
                href={`/app/profile/${p.id}`}
                className="shrink-0 w-[160px] rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04] flex flex-col"
                style={{ height: '220px' }}
              >
                {/* Photo — top 60% */}
                <div className="relative flex-none" style={{ height: '132px' }}>
                  {p.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.photo_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full brand-gradient flex items-center justify-center text-white font-extrabold text-[40px]">
                      {(p.display_name?.[0] ?? '?').toUpperCase()}
                    </div>
                  )}
                  {/* score badge */}
                  <div className="absolute top-2 right-2 h-6 px-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center">
                    <span className="text-[10px] font-extrabold text-[var(--color-primary)]">{p.score}%</span>
                  </div>
                </div>

                {/* Info — bottom 40% with dark overlay feel */}
                <div className="flex-1 px-3 py-2.5 bg-[#0d0d0d]/80 flex flex-col justify-center">
                  <p className="text-[13px] font-extrabold text-white truncate leading-tight">
                    {firstName(p.display_name)}{p.age ? `, ${p.age}` : ''}
                  </p>
                  <p className="text-[11px] text-white/50 truncate mt-0.5">
                    {p.goals?.[0] ?? p.fitness_level ?? 'Active'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── POST TRAINING TODAY CTA ── */}
      <div className="mx-5 mb-6">
        <div className="rounded-2xl brand-gradient p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-white/70 mb-0.5">Today</p>
            <p className="text-[18px] font-extrabold text-white leading-tight font-display">
              Training today?
            </p>
            <p className="text-[12px] text-white/75 mt-0.5">Let your gym know you&apos;re showing up.</p>
          </div>
          <Link
            href="/app/training-today/new"
            className="shrink-0 h-10 px-5 rounded-full bg-white text-[var(--color-primary)] font-extrabold text-[13px] flex items-center shadow-md"
          >
            Post
          </Link>
        </div>
      </div>

    </div>
  )
}

/* ── Sub-components ── */

function QuickAction({
  href,
  label,
  badge,
  children,
}: {
  href: string
  label: string
  badge?: number
  children: React.ReactNode
}) {
  return (
    <Link href={href} className="shrink-0 relative flex items-center gap-2 h-10 px-4 rounded-full bg-white/[0.04] border border-white/10 text-white/80">
      {children}
      <span className="text-[13px] font-bold whitespace-nowrap">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-0.5 h-4 min-w-4 px-1 rounded-full bg-[var(--color-primary)] text-white text-[9px] font-extrabold flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  )
}

function StatChip({
  label,
  value,
  href,
  badge = false,
  displayValue,
}: {
  label: string
  value: number | null
  href: string
  badge?: boolean
  displayValue?: string
}) {
  const numericValue = value ?? 0
  const isHighlighted = badge && numericValue > 0
  return (
    <Link href={href}>
      <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 text-center">
        <p className={`text-[22px] font-extrabold leading-none ${isHighlighted ? 'text-[var(--color-primary)]' : 'text-white'}`}>
          {displayValue !== undefined ? displayValue : numericValue}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-wide text-white/40 mt-1">
          {label}
        </p>
      </div>
    </Link>
  )
}
