// Client picker for /app/onboarding/find-location. Searches the gyms table
// and writes profiles.gym_id via the updateMyProfile server action.
'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingFrame } from '../../../../components/app/OnboardingFrame'
import { BrandButton } from '../../../../components/app/BrandButton'
import { CheckIcon } from '../../../../components/app/icons'
import { updateMyProfile } from '../../../../lib/actions/profile'

export type GymRow = {
  id: string
  name: string
  type: string
  city: string
  state: string
  members: number
}

const TYPE_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  gym: {
    label: 'Fitness Gym',
    color: 'text-[hsl(0,78%,58%)] bg-[hsl(0,78%,48%)]/15',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12" />
      </svg>
    ),
  },
  apartment: {
    label: 'Apartment Complex',
    color: 'text-blue-400 bg-blue-500/15',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="1.5" />
        <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" />
      </svg>
    ),
  },
  community_center: {
    label: 'Community Center',
    color: 'text-emerald-400 bg-emerald-500/15',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
}

const TYPE_TABS = [
  { id: 'all', label: 'All' },
  { id: 'gym', label: 'Gyms' },
  { id: 'apartment', label: 'Apartments' },
  { id: 'community_center', label: 'Community' },
]

function getMeta(type: string) {
  return TYPE_META[type] ?? {
    label: type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    color: 'text-white/60 bg-white/10',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  }
}

export function FindLocationClient({
  gyms,
  defaultGymId,
}: {
  gyms: GymRow[]
  defaultGymId: string | null
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<string>('all')
  const [selected, setSelected] = useState<string | null>(defaultGymId)
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = gyms
    if (activeTab !== 'all') list = list.filter(l => l.type === activeTab)
    if (!q) return list.slice(0, 60)
    return list.filter(
      l =>
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.state.toLowerCase().includes(q) ||
        getMeta(l.type).label.toLowerCase().includes(q),
    ).slice(0, 60)
  }, [query, gyms, activeTab])

  // Count per tab
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: gyms.length }
    for (const g of gyms) c[g.type] = (c[g.type] ?? 0) + 1
    return c
  }, [gyms])

  function handleContinue() {
    if (!selected) return
    setError(null)
    const gym = gyms.find(g => g.id === selected)
    start(async () => {
      const res = await updateMyProfile({
        gym_id: selected,
        primary_location: gym?.name ?? undefined,
      })
      if (!res.ok) {
        setError(res.error ?? 'Could not save your location.')
        return
      }
      router.push('/app/onboarding/profile')
    })
  }

  return (
    <OnboardingFrame step={3} totalSteps={5} backHref="/app/onboarding/location-type">
      <div className="mt-2">
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight">
          Find your spot
        </h1>
        <p className="mt-1.5 text-[14px] text-[var(--color-text-muted)]">
          Pick where you train: gym, apartment fitness center, or community center.
          This powers every match.
        </p>
      </div>

      {/* Search */}
      <div className="mt-5 relative">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name, city, or type..."
          className="w-full h-12 rounded-2xl border border-[var(--color-border)] bg-white/[0.04] px-11 text-[14px] text-white placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-brand)]"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        )}
      </div>

      {/* Type tabs */}
      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {TYPE_TABS.map(tab => {
          const active = activeTab === tab.id
          const count = counts[tab.id] ?? 0
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[12px] font-bold border transition ${
                active
                  ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/15 text-[var(--color-brand-bright)]'
                  : 'border-[var(--color-border)] bg-white/[0.03] text-white/55 hover:text-white/80'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${active ? 'bg-[var(--color-brand)]/20' : 'bg-white/10'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Results */}
      <div className="mt-3 space-y-2 overflow-y-auto max-h-[50dvh]">
        {results.map(l => {
          const isSelected = selected === l.id
          const meta = getMeta(l.type)
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setSelected(l.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                isSelected
                  ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10'
                  : 'border-[var(--color-border)] bg-white/[0.03] hover:border-[var(--color-border-bright)]'
              }`}
            >
              {/* Icon */}
              <div className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[var(--color-brand)]/20 text-[var(--color-brand-bright)]' : meta.color}`}>
                {meta.icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[14px] text-white truncate">{l.name}</p>
                <p className="text-[11px] text-[var(--color-text-muted)] truncate mt-0.5">
                  <span className="font-semibold">{meta.label}</span>
                  {l.city ? ` · ${[l.city, l.state].filter(Boolean).join(', ')}` : ''}
                  {` · ${l.members} member${l.members === 1 ? '' : 's'}`}
                </p>
              </div>

              {isSelected && (
                <span className="shrink-0 h-5 w-5 rounded-full bg-[var(--color-brand)] flex items-center justify-center">
                  <CheckIcon width={12} height={12} className="text-white" />
                </span>
              )}
            </button>
          )
        })}

        {results.length === 0 && (
          <div className="w-full p-5 rounded-xl border border-dashed border-[var(--color-border-bright)] text-center">
            <p className="text-[13px] text-white/85 font-semibold">No matching location found</p>
            <p className="mt-1 text-[11.5px] text-[var(--color-text-muted)]">
              Try a different search or tab, or email{' '}
              <a href="mailto:sales@fan2seeproductions.com" className="underline">sales@fan2seeproductions.com</a>
              {' '}to add your location.
            </p>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-[12.5px] text-[var(--color-danger)]">{error}</p>}

      <div className="flex-1 min-h-4" />

      <BrandButton
        size="lg"
        className="w-full mt-4"
        disabled={!selected || pending}
        onClick={handleContinue}
      >
        {pending ? 'Saving...' : 'Continue'}
      </BrandButton>
    </OnboardingFrame>
  )
}
