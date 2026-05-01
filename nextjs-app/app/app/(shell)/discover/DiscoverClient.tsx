// Client-side Discover with tabs + search + filters over real profiles.
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MapPinIcon } from '../../../../components/app/icons'

type ScoredProfile = {
  id: string
  display_name: string | null
  age: number | null
  goals: string[] | null
  styles: string[] | null
  primary_location: string | null
  photo_url: string | null
  score: number
}

type Tab = 'people' | 'locations' | 'communities'

export function DiscoverClient({ profiles }: { profiles: ScoredProfile[] }) {
  const [tab, setTab] = useState<Tab>('people')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<string | null>(null)

  const filteredPeople = useMemo(() => {
    let list = profiles
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(p => {
        return (
          p.display_name?.toLowerCase().includes(q) ||
          p.primary_location?.toLowerCase().includes(q) ||
          (p.goals ?? []).some(g => g.toLowerCase().includes(q)) ||
          (p.styles ?? []).some(s => s.toLowerCase().includes(q))
        )
      })
    }
    if (filter === 'high-match') list = list.filter(p => p.score >= 80)
    return list
  }, [profiles, query, filter])

  return (
    <main className="mx-auto max-w-md px-5 pt-3 pb-2">
      <header className="pt-2 pb-3">
        <h1 className="text-[24px] font-extrabold tracking-tight">Discover</h1>
      </header>

      <div className="relative">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search people, gyms, communities..."
          className="w-full h-12 rounded-2xl border border-[var(--color-border)] bg-white/[0.04] pl-11 pr-12 text-[14px] text-white placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-brand)]"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-[var(--color-border)]">
        {(['people','locations','communities'] as Tab[]).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 h-9 rounded-full text-[12.5px] font-semibold capitalize transition ${
              tab === t
                ? 'brand-gradient text-white shadow-[0_4px_12px_-2px_rgba(59,130,246,0.5)]'
                : 'text-[var(--color-text-muted)] hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Filter chips */}
      {tab === 'people' && (
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
          {[
            { id: null, label: 'All' },
            { id: 'high-match', label: 'High match' },
          ].map(c => (
            <button
              key={c.id ?? 'all'}
              onClick={() => setFilter(c.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium border whitespace-nowrap transition ${
                filter === c.id
                  ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/15 text-[var(--color-brand-bright)]'
                  : 'border-[var(--color-border-bright)] bg-white/[0.04] text-white/85 hover:bg-white/[0.08]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* People list */}
      <div className="mt-4 space-y-2.5">
        {tab === 'people' && filteredPeople.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--color-border-bright)] p-8 text-center">
            <p className="text-[14px] font-semibold text-white">No matches yet</p>
            <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">
              Invite friends to sign up. The more profiles, the better the matching.
            </p>
          </div>
        )}

        {tab === 'people' && filteredPeople.map(p => (
          <Link
            key={p.id}
            href={`/app/profile/${p.id}`}
            className="group flex items-center gap-3 p-2.5 rounded-2xl border border-[var(--color-border)] bg-white/[0.03] hover:border-[var(--color-border-bright)] transition"
          >
            <Avatar profile={p} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-[14px] text-white truncate">
                  {(p.display_name ?? 'Member').split(' ')[0]}
                  {p.age ? `, ${p.age}` : ''}
                </p>
                <span className="shrink-0 rounded-full bg-[var(--color-match)]/15 px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-match)]">
                  {p.score}% Match
                </span>
              </div>
              <p className="mt-0.5 text-[12px] text-[var(--color-text-muted)] truncate">
                {[(p.styles ?? []).join(' · '), (p.goals ?? []).slice(0,2).join(' · ')].filter(Boolean).join(' / ') || 'New member'}
              </p>
              {p.primary_location && (
                <div className="mt-1 flex items-center gap-1 text-[10.5px] text-[var(--color-text-dim)]">
                  <MapPinIcon width={11} height={11} /> {p.primary_location}
                </div>
              )}
            </div>
          </Link>
        ))}

        {(tab === 'locations' || tab === 'communities') && (
          <div className="rounded-2xl border border-dashed border-[var(--color-border-bright)] p-8 text-center">
            <p className="text-[14px] font-semibold text-white">Coming soon</p>
            <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">
              {tab === 'locations'
                ? 'Browse gyms, parks, run clubs by location.'
                : 'Find local fitness communities to join.'}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

function Avatar({ profile }: { profile: { display_name: string | null; photo_url: string | null } }) {
  if (profile.photo_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={profile.photo_url} alt={profile.display_name ?? 'Member'} className="shrink-0 h-16 w-16 rounded-2xl object-cover" loading="lazy" />
    )
  }
  return (
    <div className="shrink-0 h-16 w-16 rounded-2xl brand-gradient flex items-center justify-center text-white text-xl font-bold">
      {profile.display_name?.[0]?.toUpperCase() ?? '?'}
    </div>
  )
}
