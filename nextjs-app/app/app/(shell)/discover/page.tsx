// Discover. Search, filter, and browse people, locations, and communities.
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { matchPhotos, locationPhotos } from '../../../../lib/photos'
import { MapPinIcon, VerifiedIcon } from '../../../../components/app/icons'

type Tab = 'people' | 'locations' | 'communities'

const peopleData = [
  { id: 'marcus',  name: 'Marcus Johnson',  age: 28, photo: matchPhotos.marcus,  score: 93, focus: 'Strength · Gym',   distance: '1.3km', activity: 'Strength', status: 'Available now' },
  { id: 'jasmine', name: 'Jasmine Patel',   age: 27, photo: matchPhotos.jasmine, score: 92, focus: 'Yoga · Cardio',    distance: '1.5km', activity: 'Yoga',     status: 'Evening' },
  { id: 'priya',   name: 'Priya Sharma',    age: 26, photo: matchPhotos.priya,   score: 90, focus: 'HIIT · Yoga',      distance: '1.2km', activity: 'HIIT',     status: 'Morning' },
  { id: 'ethan',   name: 'Ethan Miller',    age: 31, photo: matchPhotos.ethan,   score: 88, focus: 'Run Club · HIIT',  distance: '1.3km', activity: 'Run',      status: 'Weekends' },
  { id: 'david',   name: 'David Lee',       age: 29, photo: matchPhotos.david,   score: 86, focus: 'Boxing',           distance: '2.1km', activity: 'Boxing',   status: 'Evenings' },
]

const locationData = [
  { id: 'eos',     name: 'EOS Fitness',           type: 'Gym',         members: 234, photo: locationPhotos.gym,     distance: '0.4 mi' },
  { id: 'pf',      name: 'Planet Fitness',        type: 'Gym',         members: 412, photo: locationPhotos.gym,     distance: '1.1 mi' },
  { id: 'park',    name: 'Towne Lake Park',       type: 'Outdoor',     members: 87,  photo: locationPhotos.park,    distance: '1.5 mi' },
  { id: 'yoga',    name: 'Hot Yoga Cypress',      type: 'Yoga Studio', members: 92,  photo: locationPhotos.yoga,    distance: '1.8 mi' },
]

const communityData = [
  { id: 'lift',  name: 'Cypress Lifters',         desc: 'Strength community at EOS West',          members: 142 },
  { id: 'wlift', name: 'Women Who Lift',          desc: 'All-women strength community',            members: 89 },
  { id: 'satr',  name: 'Saturday Run Club',       desc: 'Long runs every Saturday at 6am',         members: 67 },
  { id: 'apt',   name: 'Bridgeland Fitness Crew', desc: 'Apartment fitness center community',      members: 34 },
  { id: '5am',   name: '5am Accountability',      desc: 'Early risers who train before work',      members: 51 },
]

export default function DiscoverPage() {
  const [tab, setTab] = useState<Tab>('people')
  const [query, setQuery] = useState('')

  const people = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return peopleData
    return peopleData.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.focus.toLowerCase().includes(q) ||
      p.activity.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <main className="mx-auto max-w-md px-5 pt-3 pb-2">
      {/* Header */}
      <header className="pt-2 pb-3">
        <h1 className="text-[24px] font-extrabold tracking-tight">Discover</h1>
      </header>

      {/* Search */}
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
        <button
          aria-label="Filters"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-[var(--color-brand)]/15 text-[var(--color-brand-bright)] flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
            <circle cx="9" cy="6" r="2" fill="currentColor" /><circle cx="14" cy="12" r="2" fill="currentColor" /><circle cx="7" cy="18" r="2" fill="currentColor" />
          </svg>
        </button>
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

      {/* Quick filter chips */}
      {tab === 'people' && (
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
          {['Near me', 'Active now', 'Same gym', 'High match', 'Mornings', 'Evenings', 'Weekends'].map(c => (
            <button
              key={c}
              className="shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium border border-[var(--color-border-bright)] bg-white/[0.04] text-white/85 hover:bg-white/[0.08] whitespace-nowrap"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      <div className="mt-4 space-y-2.5">
        {tab === 'people' && people.map(p => (
          <Link
            key={p.id}
            href={`/app/profile/${p.id}`}
            className="group flex items-center gap-3 p-2.5 rounded-2xl border border-[var(--color-border)] bg-white/[0.03] hover:border-[var(--color-border-bright)] transition"
          >
            <div className="relative shrink-0 h-16 w-16 rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.photo} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-[14px] text-white truncate">
                  {p.name.split(' ')[0]}, {p.age}
                </p>
                <span className="shrink-0 rounded-full bg-[var(--color-match)]/15 px-2 py-0.5 text-[10px] font-extrabold text-[var(--color-match)]">
                  {p.score}% Match
                </span>
              </div>
              <p className="mt-0.5 text-[12px] text-[var(--color-text-muted)] truncate">
                {p.focus}
              </p>
              <div className="mt-1 flex items-center gap-2.5 text-[10.5px] text-[var(--color-text-dim)]">
                <span className="inline-flex items-center gap-0.5">
                  <MapPinIcon width={11} height={11} /> {p.distance}
                </span>
                <span>·</span>
                <span>{p.status}</span>
              </div>
            </div>
          </Link>
        ))}

        {tab === 'locations' && locationData.map(l => (
          <div
            key={l.id}
            className="rounded-2xl overflow-hidden border border-[var(--color-border)] bg-white/[0.03] hover:border-[var(--color-border-bright)] transition"
          >
            <div className="relative h-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.photo} alt={l.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-[15px] text-white truncate">{l.name}</p>
                  <VerifiedIcon className="text-[var(--color-brand-bright)]" width={14} height={14} />
                </div>
                <p className="mt-0.5 text-[11px] text-white/75">
                  {l.type} · {l.distance} · {l.members} members
                </p>
              </div>
            </div>
          </div>
        ))}

        {tab === 'communities' && communityData.map(c => (
          <div
            key={c.id}
            className="p-3.5 rounded-2xl border border-[var(--color-border)] bg-white/[0.03] hover:border-[var(--color-border-bright)] transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[14px] text-white truncate">{c.name}</p>
                <p className="mt-0.5 text-[12px] text-[var(--color-text-muted)]">{c.desc}</p>
                <p className="mt-1.5 text-[11px] text-[var(--color-text-dim)]">{c.members} members</p>
              </div>
              <button className="shrink-0 px-3.5 h-8 rounded-full brand-gradient text-white text-[12px] font-semibold">
                Join
              </button>
            </div>
          </div>
        ))}

        {tab === 'people' && people.length === 0 && (
          <div className="text-center text-[13px] text-[var(--color-text-muted)] py-8">
            No matches for &ldquo;{query}&rdquo;.
          </div>
        )}
      </div>
    </main>
  )
}
