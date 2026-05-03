// Client-side Browse: mode toggle, search, level filters, profile + trainer cards.
'use client'

import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Search, Filter, MessageCircle, Clock, Lock, Star,
  Dumbbell, Building2, UsersRound, User as UserIcon, Award, Gift,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { sendMatchRequest } from '../../../../lib/actions/matches'
import { claimConsultation } from '../../../../lib/actions/consultations'

type Profile = {
  id: string
  display_name: string | null
  age: number | null
  fitness_level: string | null
  goals: string[] | null
  styles: string[] | null
  primary_location: string | null
  vibe: string | null
  photo_url: string | null
  is_premium?: boolean
  score: number
}

type Trainer = {
  id: string
  gym_id: string
  name: string
  bio: string
  specialties: string[]
  photo_url: string | null
  booking_link: string | null
}

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const
type Level = typeof levels[number]

export function BrowseClient({
  profiles,
  trainers,
  claimedGymIds,
  isPremium,
}: {
  profiles: Profile[]
  trainers: Trainer[]
  claimedGymIds: string[]
  isPremium: boolean
}) {
  const router = useRouter()
  const [mode, setMode] = useState<'partner' | 'trainer'>('partner')
  const [filter, setFilter] = useState<Level>('All')
  const [query, setQuery] = useState('')
  const [pending, start] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)
  const claimed = useMemo(() => new Set(claimedGymIds), [claimedGymIds])

  const filtered = useMemo(() => {
    let list = profiles
    if (filter !== 'All') list = list.filter(p => p.fitness_level === filter)
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(p =>
        p.display_name?.toLowerCase().includes(q) ||
        (p.goals ?? []).some(g => g.toLowerCase().includes(q)) ||
        (p.vibe ?? '').toLowerCase().includes(q),
      )
    }
    return list
  }, [profiles, filter, query])

  const DISPLAY_LIMIT = 2

  function connect(profileId: string) {
    setBusyId(profileId)
    start(async () => {
      try {
        const res = await sendMatchRequest(profileId)
        if (res.matched) router.push(`/app/messages/${res.matchId}`)
        else router.push('/app/matches?tab=incoming')
      } catch {
        // swallow; UI doesn't block
      } finally {
        setBusyId(null)
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24 space-y-6">
      {/* Header */}
      <div className="space-y-4 sticky top-0 bg-[var(--color-background)]/95 backdrop-blur-sm z-30 py-2 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold font-display text-[var(--color-primary)]">Find a Partna</h1>
          {!isPremium && (
            <Link
              href="/app/coach"
              className="text-xs font-bold bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-[var(--color-secondary)]/20 transition"
            >
              <Star className="w-3 h-3 fill-[var(--color-secondary)]" />
              Upgrade
            </Link>
          )}
        </div>

        {/* Mode toggle */}
        <div className="flex bg-[var(--color-muted)] rounded-xl p-1">
          <button
            type="button"
            onClick={() => setMode('partner')}
            className={cn(
              'flex-1 py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2',
              mode === 'partner'
                ? 'bg-white text-[var(--color-primary)] shadow-sm'
                : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
            )}
          >
            <UserIcon className="w-4 h-4" /> Workout Partners
          </button>
          <button
            type="button"
            onClick={() => setMode('trainer')}
            className={cn(
              'flex-1 py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2',
              mode === 'trainer'
                ? 'bg-white text-[var(--color-secondary)] shadow-sm'
                : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
            )}
          >
            <Award className="w-4 h-4" /> Personal Trainers
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, goal, or vibe..."
              className="w-full pl-9 pr-4 py-3 bg-white rounded-xl border border-[var(--color-border)] shadow-sm focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] outline-none transition text-sm"
            />
          </div>
          <button className="p-3 bg-white rounded-xl border border-[var(--color-border)] shadow-sm hover:bg-gray-50 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition relative">
            <Filter className="w-5 h-5" />
            {!isPremium && (
              <div className="absolute -top-1 -right-1 bg-[var(--color-secondary)] text-white rounded-full p-0.5 border border-white">
                <Lock className="w-2.5 h-2.5" />
              </div>
            )}
          </button>
        </div>

        {/* Level filters (partner mode only) */}
        {mode === 'partner' && (
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {levels.map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setFilter(level)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition border',
                  filter === level
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md'
                    : 'bg-white text-[var(--color-muted-foreground)] border-[var(--color-border)] hover:border-[var(--color-primary)]/30',
                )}
              >
                {level}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Trainer mode */}
      {mode === 'trainer' && (
        trainers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[var(--color-muted)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-[var(--color-muted-foreground)]" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-[var(--color-foreground)]">No Trainers Available</h3>
            <p className="text-[var(--color-muted-foreground)] text-sm">Check back soon for personal trainers in your area.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainers.map(t => {
              const hasClaimed = claimed.has(t.gym_id)
              return (
                <div key={t.id} className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                  <div className="p-4">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[var(--color-secondary)]/30 to-[var(--color-primary)]/30 flex items-center justify-center text-xl font-bold text-[var(--color-secondary)] shrink-0">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-[var(--color-foreground)]">{t.name}</h3>
                        <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2">{t.bio}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {t.specialties?.map((s, i) => (
                        <span key={i} className="bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] text-xs font-bold px-2 py-0.5 rounded-full capitalize">
                          {s.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
                    {hasClaimed ? (
                      <div className="flex items-center justify-center gap-2 text-[var(--color-accent)] font-bold text-sm">
                        <Gift className="w-4 h-4" /> Consultation Claimed
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setBusyId(t.id)
                          start(async () => {
                            await claimConsultation({ trainerId: t.id, gymId: t.gym_id })
                            setBusyId(null)
                          })
                        }}
                        disabled={pending && busyId === t.id}
                        className="w-full py-2.5 bg-[var(--color-secondary)] text-white rounded-xl font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        <Gift className="w-4 h-4" />
                        {pending && busyId === t.id ? 'Claiming...' : 'Claim Free Consultation'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      {/* Partner mode */}
      {mode === 'partner' && (
        filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[var(--color-muted)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[var(--color-muted-foreground)]" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-[var(--color-foreground)]">No Partnas Found</h3>
            <p className="text-[var(--color-muted-foreground)] text-sm">Be the first at your location! Invite friends to join.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((p, idx) => {
              const isLocked = !isPremium && idx >= DISPLAY_LIMIT
              if (isLocked) {
                return (
                  <div key={p.id} className="relative bg-white rounded-3xl p-4 border border-dashed border-[var(--color-muted-foreground)]/30 shadow-sm overflow-hidden flex flex-col justify-center items-center gap-3 min-h-[200px]">
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10" />
                    <div className="absolute inset-0 p-4 opacity-20 blur-sm">
                      <div className="flex gap-4">
                        <div className="h-24 w-24 rounded-2xl bg-[var(--color-muted)]" />
                        <div className="flex-1 space-y-2">
                          <div className="h-6 w-3/4 bg-[var(--color-muted)] rounded" />
                          <div className="h-4 w-1/2 bg-[var(--color-muted)] rounded" />
                        </div>
                      </div>
                    </div>
                    <div className="relative z-20 flex flex-col items-center text-center p-6">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center mb-3">
                        <Lock className="w-6 h-6 text-[var(--color-secondary)]" />
                      </div>
                      <h3 className="font-bold text-lg font-display text-[var(--color-foreground)]">Unlock More Partnas</h3>
                      <p className="text-sm text-[var(--color-muted-foreground)] mb-4">Upgrade to see everyone at your gym.</p>
                      <Link
                        href="/app/coach"
                        className="px-5 py-2 bg-[var(--color-secondary)] text-white rounded-xl text-sm font-bold hover:opacity-90 transition shadow-sm"
                      >
                        Upgrade Now
                      </Link>
                    </div>
                  </div>
                )
              }

              return (
                <div key={p.id} className="bg-white rounded-3xl p-4 border border-[var(--color-border)] shadow-sm hover:shadow-lg transition-all">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 rounded-2xl overflow-hidden shrink-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20">
                      {p.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[var(--color-primary)]">
                          {(p.display_name ?? '?')[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg font-display text-[var(--color-foreground)]">
                            {p.display_name?.split(' ')[0] ?? 'Anonymous'}{p.age ? `, ${p.age}` : ''}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-[var(--color-muted-foreground)]">
                            <Dumbbell className="w-3 h-3" />
                            <span>{p.primary_location || 'Unknown Location'}</span>
                          </div>
                        </div>
                        <span className="bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-bold px-2 py-1 rounded-full">
                          {p.score}%
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.fitness_level && (
                          <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {p.fitness_level}
                          </span>
                        )}
                        {(p.goals ?? []).slice(0, 2).map((g, i) => (
                          <span key={i} className="bg-[var(--color-muted)] text-[var(--color-muted-foreground)] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4 pt-4 border-t border-[var(--color-border)]/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{p.vibe || 'Friendly Chat'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => connect(p.id)}
                        disabled={pending && busyId === p.id}
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-[var(--color-secondary)] text-white rounded-xl text-xs font-bold hover:opacity-90 transition shadow-sm disabled:opacity-60"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        {pending && busyId === p.id ? 'Connecting...' : 'Connect'}
                      </button>
                      <Link
                        href={`/app/profile/${p.id}`}
                        className="px-3 py-2 border border-[var(--color-border)] rounded-xl text-xs font-bold hover:bg-[var(--color-muted)] transition text-[var(--color-foreground)]"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}
