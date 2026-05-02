// Client-side Communities (gyms / apartments / community centers) browser.
'use client'

import { useState, useMemo } from 'react'
import { MapPin, Users, ArrowRight, Dumbbell, Building2, UsersRound } from 'lucide-react'
import { cn } from '../../../../lib/utils'

export type LocationType = 'gym' | 'apartment' | 'community_center'

export type Location = {
  id: string
  name: string
  type: LocationType
  address: string
  city: string
  state: string
  members: number | null
  image: string | null
}

const typeConfig: Record<LocationType, { label: string; icon: typeof Dumbbell; color: string }> = {
  gym:              { label: 'Gym',              icon: Dumbbell,    color: 'bg-orange-100 text-orange-700' },
  apartment:        { label: 'Apartment Gym',    icon: Building2,   color: 'bg-blue-100 text-blue-700' },
  community_center: { label: 'Community Center', icon: UsersRound,  color: 'bg-green-100 text-green-700' },
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&q=80'

export function GymsClient({ locations }: { locations: Location[] }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | LocationType>('all')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return locations.filter(loc => {
      const matches =
        !q ||
        loc.name.toLowerCase().includes(q) ||
        loc.address.toLowerCase().includes(q) ||
        loc.city.toLowerCase().includes(q)
      const matchesType = typeFilter === 'all' || loc.type === typeFilter
      return matches && matchesType
    })
  }, [locations, search, typeFilter])

  const pillClass = (value: 'all' | LocationType) =>
    cn(
      'px-4 py-2 rounded-full text-sm font-bold border transition',
      typeFilter === value
        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md'
        : 'bg-white text-[var(--color-muted-foreground)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50',
    )

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24 space-y-6">

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold font-display text-[var(--color-primary)]">Communities</h1>
        <p className="text-[var(--color-muted-foreground)]">
          Find Partnas at your gym, apartment building, or local community center.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setTypeFilter('all')} className={pillClass('all')}>All</button>
        <button type="button" onClick={() => setTypeFilter('gym')} className={pillClass('gym')}>
          <span className="flex items-center gap-1.5"><Dumbbell className="w-4 h-4" /> Gyms</span>
        </button>
        <button type="button" onClick={() => setTypeFilter('apartment')} className={pillClass('apartment')}>
          <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Apartments</span>
        </button>
        <button type="button" onClick={() => setTypeFilter('community_center')} className={pillClass('community_center')}>
          <span className="flex items-center gap-1.5"><UsersRound className="w-4 h-4" /> Community Centers</span>
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search by name or city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-4 pr-4 py-3 bg-white rounded-xl border border-[var(--color-border)] shadow-sm focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] outline-none transition text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(loc => {
          const cfg = typeConfig[loc.type] ?? typeConfig.gym
          const Icon = cfg.icon
          return (
            <div key={loc.id} className="group bg-white rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm hover:shadow-md transition">
              <div className="h-32 bg-[var(--color-muted)] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={loc.image || FALLBACK_IMG}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={cn('absolute top-2 right-2 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1', cfg.color)}>
                  <Icon className="w-3 h-3" />
                  {cfg.label}
                </div>
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {Math.max(2, Math.min((loc.members ?? 0) / 30, 9)).toFixed(0)} live
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg font-display text-[var(--color-foreground)]">{loc.name}</h3>
                <p className="text-sm text-[var(--color-muted-foreground)] flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {loc.city}, {loc.state}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border)]/50">
                  <div className="flex gap-4 text-xs font-medium text-[var(--color-muted-foreground)]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {loc.members ?? 0} members
                    </span>
                  </div>
                  <button className="text-xs font-bold text-[var(--color-secondary)] flex items-center gap-1 hover:underline">
                    View Community <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--color-muted-foreground)]">No communities found matching your search.</p>
        </div>
      )}

      <div className="text-center text-xs text-[var(--color-muted-foreground)] pt-4">
        Also trusted inside apartments and local community centers.
      </div>
    </div>
  )
}
