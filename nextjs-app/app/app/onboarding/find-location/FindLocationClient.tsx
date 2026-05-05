// Client picker for /app/onboarding/find-location. Searches the gyms table
// and writes profiles.gym_id via the updateMyProfile server action.
'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingFrame } from '../../../../components/app/OnboardingFrame'
import { BrandButton } from '../../../../components/app/BrandButton'
import { CheckIcon, MapPinIcon } from '../../../../components/app/icons'
import { updateMyProfile } from '../../../../lib/actions/profile'

export type GymRow = {
  id: string
  name: string
  type: string
  city: string
  state: string
  members: number
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
  const [selected, setSelected] = useState<string | null>(defaultGymId)
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return gyms.slice(0, 50)
    return gyms.filter(
      l =>
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.state.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q),
    ).slice(0, 50)
  }, [query, gyms])

  function handleContinue() {
    if (!selected) return
    setError(null)
    const gym = gyms.find(g => g.id === selected)
    start(async () => {
      const res = await updateMyProfile({
        gym_id: selected,
        // Mirror name into legacy text column so older code paths still read sane data.
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
          Pick the gym, apartment fitness center, or community where you train. This is the most
          important field, it powers every match.
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
      <div className="mt-4 space-y-2 overflow-y-auto max-h-[55dvh]">
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
                  {l.type} · {[l.city, l.state].filter(Boolean).join(', ')} · {l.members} member{l.members === 1 ? '' : 's'}
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
          <div className="w-full p-4 rounded-xl border border-dashed border-[var(--color-border-bright)] text-center">
            <p className="text-[13px] text-white/85 font-semibold">
              No matching location yet
            </p>
            <p className="mt-1 text-[11.5px] text-[var(--color-text-muted)]">
              Try a different search, or contact us at{' '}
              <a href="mailto:hello@workoutpartna.com" className="underline">hello@workoutpartna.com</a>
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
