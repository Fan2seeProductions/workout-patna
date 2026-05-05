// Browse shell with the 5 tabs from the spec:
//   At My Location · Nearby · Training Today · Groups · Trainers
// People rows reuse the new card with real gym name + explainer badges.
// "Groups" is a placeholder until communities ship.
'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { sendMatchRequest } from '../../../../lib/actions/matches'

export type GymLite = { id: string; name: string; type: string; city: string; state: string }
export type TrainerLite = {
  id: string
  gym_id: string
  name: string
  bio: string | null
  specialties: string[] | null
  photo_url: string | null
  booking_link: string | null
}
export type TrainingTodayPost = {
  id: string
  user_id: string
  gym_id: string
  starts_at: string
  workout_type: string | null
  notes: string | null
  looking_for: string[] | null
  status: 'open' | 'filled' | 'cancelled' | 'done'
  user: { id: string; display_name: string | null; photo_url: string | null } | null
  gym:  { id: string; name: string; city: string } | null
}
export type BrowseProfile = {
  id: string
  display_name: string | null
  age: number | null
  bio: string | null
  fitness_level: string | null
  goals: string[] | null
  styles: string[] | null
  schedule_days: string[] | null
  schedule_times: string[] | null
  vibe: string | null
  primary_location: string | null
  gym_id: string | null
  photo_url: string | null
  is_premium?: boolean | null
  gym: GymLite | null
  score: number | null
  badges: string[]
}

type Me = {
  id: string
  gym_id: string | null
  isPremium: boolean
  onboarded: boolean
  gym: GymLite | null
}

const TABS = ['At My Location', 'Nearby', 'Training Today', 'Groups', 'Trainers'] as const
type Tab = typeof TABS[number]

const FILTER_GOALS = ['Build Muscle','Lose Weight','Get Stronger','Endurance','Stay Consistent']
const FILTER_TIMES = ['Mornings','Midday','Evenings','Late night']
const FILTER_LEVEL = ['Beginner','Intermediate','Advanced','Athlete']

export function BrowseShell({
  me,
  profiles,
  trainers,
  trainingToday,
}: {
  me: Me
  profiles: BrowseProfile[]
  trainers: TrainerLite[]
  trainingToday: TrainingTodayPost[]
}) {
  const [tab, setTab] = useState<Tab>(me.gym_id ? 'At My Location' : 'Nearby')
  const [query, setQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [goal, setGoal] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [level, setLevel] = useState<string | null>(null)

  // ── Filter the people list based on selected tab + filters ─────────
  const peopleList = useMemo(() => {
    let list = profiles
    if (tab === 'At My Location' && me.gym_id) {
      list = list.filter(p => p.gym_id === me.gym_id)
    }
    // "Nearby" = everyone we already loaded (premium users see all,
    // free users only get their gym pre-filtered server-side anyway)
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(p =>
        p.display_name?.toLowerCase().includes(q) ||
        p.gym?.name.toLowerCase().includes(q) ||
        (p.goals ?? []).some(g => g.toLowerCase().includes(q)) ||
        (p.styles ?? []).some(s => s.toLowerCase().includes(q)),
      )
    }
    if (goal)  list = list.filter(p => (p.goals  ?? []).includes(goal))
    if (level) list = list.filter(p => p.fitness_level === level)
    if (time)  list = list.filter(p => (p.schedule_times ?? []).includes(time))
    return list
  }, [profiles, tab, query, goal, level, time, me.gym_id])

  // ── Empty state when no gym yet ────────────────────────────────────
  if (!me.gym_id && tab === 'At My Location') {
    return (
      <main className="mx-auto max-w-md px-5 pt-3 pb-2">
        <Header />
        <Tabs tab={tab} setTab={setTab} />
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border-bright)] p-8 text-center">
          <p className="text-[16px] font-bold text-[var(--color-foreground)]">Choose your location first</p>
          <p className="mt-2 text-[13.5px] text-[var(--color-muted-foreground)]">
            To find the right Partnas, select the gym, apartment, or community where you train.
          </p>
          <Link
            href="/app/profile/edit"
            className="mt-5 inline-flex h-11 px-6 rounded-full brand-gradient text-white items-center font-bold text-[14px] shadow-glow"
          >
            Set My Location
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-md px-5 pt-3 pb-2">
      <Header />
      <Tabs tab={tab} setTab={setTab} />

      {/* Search + filter (people / training today only) */}
      {(tab === 'At My Location' || tab === 'Nearby' || tab === 'Trainers') && (
        <div className="mt-3 relative">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, goal, gym, vibe, or workout style"
            className="w-full h-11 rounded-2xl border border-[var(--color-border)] bg-white pl-10 pr-12 text-[14px] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-primary)]"
          />
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <button
            onClick={() => setFilterOpen(o => !o)}
            aria-label="Filters"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
              <circle cx="9" cy="6" r="2" fill="currentColor" /><circle cx="14" cy="12" r="2" fill="currentColor" /><circle cx="7" cy="18" r="2" fill="currentColor" />
            </svg>
          </button>
        </div>
      )}

      {filterOpen && (
        <div className="mt-3 rounded-2xl border border-[var(--color-border)] bg-white p-4 space-y-3">
          <FilterRow label="Goal" value={goal} setValue={setGoal} options={FILTER_GOALS} />
          <FilterRow label="Time" value={time} setValue={setTime} options={FILTER_TIMES} />
          <FilterRow label="Level" value={level} setValue={setLevel} options={FILTER_LEVEL} />
          {(goal || level || time) && (
            <button
              onClick={() => { setGoal(null); setLevel(null); setTime(null) }}
              className="text-[12px] font-semibold text-[var(--color-muted-foreground)] underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Tab content ───────────────────────────────────────────── */}
      <div className="mt-4">
        {(tab === 'At My Location' || tab === 'Nearby') && (
          <PeopleList list={peopleList} myGym={me.gym} />
        )}
        {tab === 'Training Today' && (
          <TrainingTodayList posts={trainingToday} myGymId={me.gym_id} />
        )}
        {tab === 'Groups' && <GroupsPlaceholder />}
        {tab === 'Trainers' && (
          <TrainerList trainers={trainers} myGymId={me.gym_id} query={query} />
        )}
      </div>
    </main>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────

function Header() {
  return (
    <header className="pt-2 pb-3 flex items-center justify-between">
      <h1 className="text-[24px] font-extrabold tracking-tight text-[var(--color-foreground)]">Find Partnas</h1>
      <Link
        href="/app/training-today/new"
        className="text-[12px] font-bold text-[var(--color-primary)] inline-flex items-center gap-1"
      >
        + Post Training Today
      </Link>
    </header>
  )
}

function Tabs({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
      {TABS.map(t => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`shrink-0 h-9 px-4 rounded-full text-[12.5px] font-semibold whitespace-nowrap transition ${
            tab === t
              ? 'brand-gradient text-white shadow-[0_4px_12px_-2px_rgba(30,99,233,0.5)]'
              : 'bg-white border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

function FilterRow({
  label, value, setValue, options,
}: {
  label: string
  value: string | null
  setValue: (v: string | null) => void
  options: string[]
}) {
  return (
    <div>
      <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)] mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map(o => {
          const on = value === o
          return (
            <button
              key={o}
              onClick={() => setValue(on ? null : o)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition ${
                on
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'border-[var(--color-border)] bg-white text-[var(--color-foreground)]/85'
              }`}
            >
              {o}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PeopleList({ list, myGym }: { list: BrowseProfile[]; myGym: GymLite | null }) {
  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-border-bright)] p-7 text-center">
        <p className="text-[15px] font-bold text-[var(--color-foreground)]">No Partnas found yet</p>
        <p className="mt-1 text-[12.5px] text-[var(--color-muted-foreground)]">
          Invite people from your gym or apartment community to help grow this location.
        </p>
        <Link href="/app/profile" className="mt-4 inline-flex h-10 px-5 rounded-full brand-gradient text-white items-center font-bold text-[13px]">
          Invite Members
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {list.map(p => <PersonCard key={p.id} p={p} sameGym={!!(myGym && p.gym_id === myGym.id)} />)}
    </div>
  )
}

function PersonCard({ p, sameGym }: { p: BrowseProfile; sameGym: boolean }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [sent, setSent] = useState<'idle' | 'sent' | 'matched'>('idle')

  function connect() {
    start(async () => {
      try {
        const res = await sendMatchRequest(p.id)
        setSent(res.matched ? 'matched' : 'sent')
        if (res.matched) router.push(`/app/messages/${res.matchId}`)
      } catch {
        // surfaced via the button label
      }
    })
  }

  const initial = (p.display_name ?? '?')[0]?.toUpperCase()
  const focus = [p.styles?.[0], p.goals?.[0]].filter(Boolean).join(' · ') || 'New Partna'
  const locationLabel = p.gym?.name
    ? `${p.gym.name}${p.gym.city ? ` · ${p.gym.city}` : ''}`
    : p.primary_location
    ? p.primary_location
    : 'No location set yet'
  const scheduleLabel = (p.schedule_times ?? []).join(', ') || (p.schedule_days ?? []).join(', ')

  return (
    <Link
      href={`/app/profile/${p.id}`}
      className="block rounded-2xl border border-[var(--color-border)] bg-white p-3 hover:border-[var(--color-primary)]/40 transition"
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0 h-16 w-16 rounded-2xl overflow-hidden bg-[var(--color-muted)]">
          {p.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.photo_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-2xl font-extrabold text-[var(--color-primary)]">
              {initial}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-bold text-[14px] truncate text-[var(--color-foreground)]">
              {(p.display_name ?? 'Member').split(' ')[0]}{p.age ? `, ${p.age}` : ''}
            </p>
            {p.score === null ? (
              <span className="shrink-0 text-[10px] font-semibold text-[var(--color-muted-foreground)]">
                Complete profile to see match
              </span>
            ) : (
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                p.score >= 70
                  ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                  : p.score >= 40
                  ? 'bg-[var(--color-secondary)]/15 text-[var(--color-secondary)]'
                  : 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]'
              }`}>
                {p.score}% Match
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[12.5px] text-[var(--color-muted-foreground)] truncate">{focus}</p>
          <p className="mt-0.5 text-[11px] text-[var(--color-muted-foreground)] truncate">📍 {locationLabel}</p>
          {scheduleLabel && (
            <p className="mt-0.5 text-[11px] text-[var(--color-muted-foreground)] truncate">⏰ {scheduleLabel}</p>
          )}

          {/* Explainer badges */}
          {p.badges.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {sameGym && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  Same gym
                </span>
              )}
              {p.badges.filter(b => b !== 'Same gym').slice(0, 2).map(b => (
                <span key={b} className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={(e) => { e.preventDefault(); connect() }}
          disabled={pending || sent !== 'idle'}
          className="h-9 rounded-full brand-gradient text-white text-[12.5px] font-bold disabled:opacity-50"
        >
          {sent === 'sent' ? 'Request sent' : sent === 'matched' ? 'Message →' : pending ? 'Connecting...' : 'Connect'}
        </button>
        <span className="h-9 rounded-full border border-[var(--color-border)] bg-white text-[var(--color-foreground)] text-[12.5px] font-bold inline-flex items-center justify-center">
          View Profile
        </span>
      </div>
    </Link>
  )
}

function TrainingTodayList({
  posts, myGymId,
}: {
  posts: TrainingTodayPost[]
  myGymId: string | null
}) {
  const [scope, setScope] = useState<'all' | 'mine'>(myGymId ? 'mine' : 'all')

  const list = useMemo(() => {
    return posts
      .filter(p => p.status === 'open')
      .filter(p => scope === 'all' || p.gym_id === myGymId)
  }, [posts, scope, myGymId])

  return (
    <div>
      {myGymId && (
        <div className="mb-3 inline-flex p-1 rounded-full bg-white border border-[var(--color-border)] text-[12px] font-semibold">
          <button
            onClick={() => setScope('mine')}
            className={`px-3 py-1.5 rounded-full ${scope === 'mine' ? 'brand-gradient text-white' : 'text-[var(--color-muted-foreground)]'}`}
          >
            At my gym
          </button>
          <button
            onClick={() => setScope('all')}
            className={`px-3 py-1.5 rounded-full ${scope === 'all' ? 'brand-gradient text-white' : 'text-[var(--color-muted-foreground)]'}`}
          >
            Everywhere
          </button>
        </div>
      )}

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border-bright)] p-7 text-center">
          <p className="text-[15px] font-bold text-[var(--color-foreground)]">No one is training today (yet)</p>
          <p className="mt-1 text-[12.5px] text-[var(--color-muted-foreground)]">
            Be first. Post when and where you'll train. Other Partnas at your gym will see it.
          </p>
          <Link href="/app/training-today/new" className="mt-4 inline-flex h-10 px-5 rounded-full brand-gradient text-white items-center font-bold text-[13px]">
            Post Training Today
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {list.map(t => {
            const time = new Date(t.starts_at)
            const timeLabel = time.toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })
            return (
              <div key={t.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 h-12 w-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-extrabold flex items-center justify-center">
                    {(t.user?.display_name ?? '?')[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[14px] text-[var(--color-foreground)]">
                      {t.user?.display_name ?? 'A Partna'} · <span className="text-[var(--color-primary)]">{timeLabel}</span>
                    </p>
                    {t.gym?.name && (
                      <p className="mt-0.5 text-[11.5px] text-[var(--color-muted-foreground)]">📍 {t.gym.name}</p>
                    )}
                    {t.workout_type && (
                      <p className="mt-1 text-[13px] text-[var(--color-foreground)]">
                        🏋️ {t.workout_type}
                      </p>
                    )}
                    {t.notes && <p className="mt-1 text-[12.5px] text-[var(--color-muted-foreground)]">{t.notes}</p>}
                    {(t.looking_for ?? []).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {t.looking_for!.map(l => (
                          <span key={l} className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
                            {l.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Link
                  href={`/app/profile/${t.user_id}`}
                  className="mt-3 block w-full h-9 rounded-full border border-[var(--color-border)] text-center text-[12.5px] font-bold inline-flex items-center justify-center text-[var(--color-foreground)]"
                >
                  View Partna →
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function GroupsPlaceholder() {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--color-border-bright)] p-7 text-center">
      <p className="text-[15px] font-bold text-[var(--color-foreground)]">Groups are coming soon</p>
      <p className="mt-1 text-[12.5px] text-[var(--color-muted-foreground)]">
        Join run clubs, women-who-lift groups, 5am crews, and apartment fitness communities at your location.
      </p>
    </div>
  )
}

function TrainerList({
  trainers, myGymId, query,
}: {
  trainers: TrainerLite[]
  myGymId: string | null
  query: string
}) {
  const list = useMemo(() => {
    let l = trainers
    if (myGymId) l = l.filter(t => t.gym_id === myGymId || true)
    const q = query.trim().toLowerCase()
    if (q) l = l.filter(t =>
      t.name.toLowerCase().includes(q) ||
      (t.specialties ?? []).some(s => s.toLowerCase().includes(q)),
    )
    return l
  }, [trainers, myGymId, query])

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-border-bright)] p-7 text-center">
        <p className="text-[15px] font-bold text-[var(--color-foreground)]">No trainers yet</p>
        <p className="mt-1 text-[12.5px] text-[var(--color-muted-foreground)]">
          We're onboarding trainers in your area. Check back soon.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {list.map(t => (
        <Link key={t.id} href={`/app/trainers/${t.id}`} className="block rounded-2xl border border-[var(--color-border)] bg-white p-3">
          <div className="flex items-start gap-3">
            <div className="shrink-0 h-14 w-14 rounded-xl overflow-hidden bg-[var(--color-muted)]">
              {t.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.photo_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xl font-extrabold text-[var(--color-primary)]">
                  {t.name[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[14px] text-[var(--color-foreground)]">{t.name}</p>
              <p className="mt-0.5 text-[12.5px] text-[var(--color-muted-foreground)] line-clamp-1">
                {(t.specialties ?? []).join(' · ') || 'Trainer'}
              </p>
              <p className="mt-1.5 text-[11px] uppercase tracking-wider font-bold text-[var(--color-primary)]">
                Free consultation →
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
