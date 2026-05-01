// Onboarding step 3: find your specific gym or location.
'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingFrame } from '../../../../components/app/OnboardingFrame'
import { BrandButton } from '../../../../components/app/BrandButton'
import { CheckIcon, MapPinIcon } from '../../../../components/app/icons'

// Mock location data. Will be replaced with Yelp API + Supabase results later.
const allLocations = [
  { id: '1', name: 'EOS Fitness',                    address: 'Cypress, TX',     type: 'Gym',          distance: '0.4 mi' },
  { id: '2', name: 'Planet Fitness',                 address: 'Houston, TX',     type: 'Gym',          distance: '1.1 mi' },
  { id: '3', name: 'LA Fitness',                     address: 'Cypress, TX',     type: 'Gym',          distance: '1.8 mi' },
  { id: '4', name: 'Bridgeland Fitness Center',      address: 'Cypress, TX',     type: 'Apartment',    distance: '0.2 mi' },
  { id: '5', name: 'Towne Lake Park',                address: 'Cypress, TX',     type: 'Park',         distance: '1.5 mi' },
  { id: '6', name: 'Cypress YMCA',                   address: 'Cypress, TX',     type: 'Community',    distance: '2.1 mi' },
  { id: '7', name: 'Bridgeland Run Club',            address: 'Cypress, TX',     type: 'Run Club',     distance: 'Saturdays 6am' },
  { id: '8', name: 'CrossFit Cypress',               address: 'Cypress, TX',     type: 'Gym',          distance: '2.4 mi' },
]

export default function FindLocationPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allLocations
    return allLocations.filter(
      l =>
        l.name.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <OnboardingFrame step={3} totalSteps={5} backHref="/app/onboarding/location-type">
      <div className="mt-2">
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight">
          Find your spot
        </h1>
        <p className="mt-1.5 text-[14px] text-[var(--color-text-muted)]">
          Pick your primary gym, complex, or run club.
        </p>
      </div>

      {/* Search */}
      <div className="mt-5">
        <div className="relative">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search EOS, Planet Fitness, your apartment..."
            className="w-full h-12 rounded-2xl border border-[var(--color-border)] bg-white/[0.04] px-11 text-[14px] text-white placeholder:text-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-brand)]"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Results */}
      <div className="mt-4 space-y-2 overflow-y-auto">
        {results.map(l => {
          const isSelected = selected === l.id
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
              <div
                className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-[var(--color-brand)]/20 text-[var(--color-brand-bright)]' : 'bg-white/[0.04] text-white/70'
                }`}
              >
                <MapPinIcon width={18} height={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[14px] truncate">{l.name}</p>
                <p className="text-[11px] text-[var(--color-text-muted)] truncate">
                  {l.type} · {l.address} · {l.distance}
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
          <button className="w-full p-4 rounded-xl border border-dashed border-[var(--color-border-bright)] text-[13px] text-[var(--color-brand-bright)] font-semibold">
            + Add &ldquo;{query}&rdquo; as a custom location
          </button>
        )}
      </div>

      <div className="flex-1 min-h-4" />

      <BrandButton
        size="lg"
        className="w-full mt-4"
        disabled={!selected}
        onClick={() => router.push('/app/onboarding/profile')}
      >
        Continue
      </BrandButton>
    </OnboardingFrame>
  )
}
