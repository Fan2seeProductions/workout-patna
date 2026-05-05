// Home dashboard — mobile-first app layout.
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

  return (
    <div className="min-h-dvh bg-[var(--color-background)]">
      {/* ── Header ── */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
            {greeting()}
          </p>
          <h1 className="text-[24px] font-extrabold tracking-tight text-[var(--color-foreground)] leading-tight">
            {firstName(displayName)}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Link href="/app/messages" className="relative">
              <div className="h-9 w-9 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-primary)]">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </Link>
          )}
          <Link href="/app/profile">
            {me?.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={me.photo_url} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--color-primary)]/30" />
            ) : (
              <div className="h-10 w-10 rounded-full brand-gradient flex items-center justify-center text-white font-extrabold text-[15px]">
                {(firstName(displayName)[0] ?? '?').toUpperCase()}
              </div>
            )}
          </Link>
        </div>
      </header>

      {/* ── Quick stats ── */}
      <div className="px-5 pb-5 grid grid-cols-3 gap-3">
        <StatChip label="Matches" value={activeMatches} href="/app/matches" />
        <StatChip label="Messages" value={unreadCount} href="/app/messages" badge />
        <StatChip label="Discover" value={suggested.length} href="/app/discover" />
      </div>

      {/* ── Location ── */}
      {me?.primary_location && (
        <div className="mx-5 mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/15">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-primary)] shrink-0">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span className="text-[13px] font-semibold text-[var(--color-foreground)]">{me.primary_location}</span>
          <Link href="/app/onboarding/find-location" className="ml-auto text-[11px] font-bold text-[var(--color-primary)]">Change</Link>
        </div>
      )}

      {/* ── Train today banner ── */}
      <div className="mx-5 mb-6">
        <div className="rounded-2xl brand-gradient p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-white/70">Today</p>
            <p className="text-[17px] font-extrabold text-white leading-tight mt-0.5">
              Training today?
            </p>
            <p className="text-[12px] text-white/80 mt-0.5">Let your gym know you're showing up.</p>
          </div>
          <Link
            href="/app/training-today/new"
            className="shrink-0 h-10 px-4 rounded-full bg-white text-[var(--color-primary)] font-extrabold text-[13px] flex items-center"
          >
            Post
          </Link>
        </div>
      </div>

      {/* ── Training today at your gym ── */}
      {trainingToday.length > 0 && (
        <section className="mb-6">
          <div className="px-5 flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-extrabold text-[var(--color-foreground)]">At your gym today</h2>
            <Link href="/app/discover?tab=training" className="text-[12px] font-bold text-[var(--color-primary)]">See all</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-5">
            {trainingToday.map((t: any) => (
              <div key={t.id} className="shrink-0 w-[150px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-3.5">
                <p className="text-[13px] font-extrabold text-[var(--color-foreground)] truncate">{t.workout_type ?? 'Training'}</p>
                <p className="text-[11px] text-[var(--color-muted-foreground)] mt-0.5 truncate">
                  {t.gyms?.name ?? 'Your gym'}
                </p>
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

      {/* ── Suggested partnas ── */}
      <section className="mb-6">
        <div className="px-5 flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-extrabold text-[var(--color-foreground)]">Suggested Partnas</h2>
          <Link href="/app/discover" className="text-[12px] font-bold text-[var(--color-primary)]">See all</Link>
        </div>

        {suggested.length === 0 ? (
          <div className="mx-5 rounded-2xl border border-dashed border-[var(--color-border)] p-6 text-center">
            <p className="text-[14px] font-bold text-[var(--color-foreground)]">No suggestions yet</p>
            <p className="text-[12px] text-[var(--color-muted-foreground)] mt-1">Complete your profile to see compatible partnas.</p>
            <Link href="/app/onboarding" className="mt-3 inline-flex h-9 px-5 rounded-full brand-gradient text-white items-center font-bold text-[12px]">
              Complete Profile
            </Link>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-5">
            {suggested.map(p => (
              <Link key={p.id} href={`/app/profile/${p.id}`} className="shrink-0 w-[140px]">
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-3.5 text-center">
                  {p.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.photo_url} alt="" className="w-14 h-14 rounded-full object-cover mx-auto" />
                  ) : (
                    <div className="w-14 h-14 rounded-full brand-gradient flex items-center justify-center text-white font-extrabold text-[20px] mx-auto">
                      {(p.display_name?.[0] ?? '?').toUpperCase()}
                    </div>
                  )}
                  <p className="mt-2 text-[13px] font-extrabold text-[var(--color-foreground)] truncate">
                    {firstName(p.display_name)}
                  </p>
                  <p className="text-[11px] text-[var(--color-muted-foreground)] truncate">
                    {p.goals?.[0] ?? p.fitness_level ?? 'Active'}
                  </p>
                  <div className="mt-2 text-[11px] font-extrabold text-[var(--color-primary)]">
                    {p.score}% match
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── No location set nudge ── */}
      {!me?.primary_location && (
        <div className="mx-5 mb-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <p className="text-[14px] font-extrabold text-[var(--color-foreground)]">Set your gym or location</p>
          <p className="text-[12px] text-[var(--color-muted-foreground)] mt-1">
            We match you with people who train where you train.
          </p>
          <Link href="/app/onboarding/find-location" className="mt-3 inline-flex h-9 px-5 rounded-full brand-gradient text-white items-center font-bold text-[12px]">
            Find my gym
          </Link>
        </div>
      )}
    </div>
  )
}

function StatChip({
  label,
  value,
  href,
  badge = false,
}: {
  label: string
  value: number
  href: string
  badge?: boolean
}) {
  return (
    <Link href={href}>
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-3 text-center">
        <p className={`text-[22px] font-extrabold ${badge && value > 0 ? 'text-red-500' : 'text-[var(--color-primary)]'}`}>
          {value}
        </p>
        <p className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--color-muted-foreground)] mt-0.5">
          {label}
        </p>
      </div>
    </Link>
  )
}
