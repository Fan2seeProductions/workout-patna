// Exercise library client. Name search + muscle-group / level filter chips over
// the bundled dataset. Each card links to the public /exercises/[slug] how-to.
'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Dumbbell, Search, Filter, Flame } from 'lucide-react'
import { cn } from '../../../../lib/utils'

export type ExerciseCard = {
  id: string
  name: string
  slug: string
  level: string
  equipment: string | null
  muscle: string | null
  thumbUrl: string | null
}

// The 17 primary-muscle groups present in the dataset.
const muscles = [
  'abdominals', 'abductors', 'adductors', 'biceps', 'calves', 'chest',
  'forearms', 'glutes', 'hamstrings', 'lats', 'lower back', 'middle back',
  'neck', 'quadriceps', 'shoulders', 'traps', 'triceps',
] as const

const levels = ['beginner', 'intermediate', 'expert'] as const

const PAGE_SIZE = 60

export function WorkoutsClient({ exercises }: { exercises: ExerciseCard[] }) {
  const [query, setQuery] = useState('')
  const [muscle, setMuscle] = useState<string>('All')
  const [level, setLevel] = useState<string>('All')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return exercises.filter(ex => {
      const nameOk = !q || ex.name.toLowerCase().includes(q)
      const muscleOk = muscle === 'All' || ex.muscle === muscle
      const levelOk = level === 'All' || ex.level === level
      return nameOk && muscleOk && levelOk
    })
  }, [exercises, query, muscle, level])

  const shown = filtered.slice(0, visible)

  // Reset paging whenever the filter/search result set changes.
  function resetPaging() {
    setVisible(PAGE_SIZE)
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 pt-8 space-y-6 pb-24">
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-[var(--color-foreground)] flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          Exercise Library
        </h1>
        <p className="text-[var(--color-muted-foreground)]">
          {exercises.length} free exercises with step-by-step how-tos. Search or filter by muscle group.
        </p>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); resetPaging() }}
          placeholder="Search exercises..."
          className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl h-11 pl-10 pr-4 text-[14px] placeholder:text-white/30 text-white outline-none focus:border-white/20 transition"
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-muted-foreground)]">
          <Filter className="w-4 h-4" /> Muscle Group
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['All', ...muscles].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => { setMuscle(m); resetPaging() }}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition border capitalize',
                muscle === m
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md'
                  : 'bg-white/[0.04] text-white/70 border-white/15 hover:border-[var(--color-primary)]/40 hover:bg-white/[0.08] hover:text-white',
              )}
            >
              {m === 'All' ? 'All' : m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-muted-foreground)]">
          <Flame className="w-4 h-4" /> Level
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['All', ...levels].map(l => (
            <button
              key={l}
              type="button"
              onClick={() => { setLevel(l); resetPaging() }}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition border capitalize',
                level === l
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md'
                  : 'bg-white/[0.04] text-white/70 border-white/15 hover:border-white/30 hover:bg-white/[0.08] hover:text-white',
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/[0.04] rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-[var(--color-muted-foreground)]" />
          </div>
          <h3 className="font-bold text-lg mb-2 text-[var(--color-foreground)]">No exercises found</h3>
          <p className="text-[var(--color-muted-foreground)] text-sm">
            Try a different search or clear your filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {shown.map(ex => (
              <Link
                key={ex.id}
                href={`/exercises/${ex.slug}`}
                className="group bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--color-primary)]/40 hover:bg-white/[0.06] transition"
              >
                <div className="aspect-square w-full bg-white overflow-hidden">
                  {ex.thumbUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ex.thumbUrl}
                      alt={ex.name}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-white/[0.04] text-[var(--color-muted-foreground)]">
                      <Dumbbell className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-[13.5px] leading-snug text-[var(--color-foreground)] line-clamp-2">
                    {ex.name}
                  </h3>
                  <p className="mt-1 text-[11.5px] text-[var(--color-muted-foreground)] capitalize">
                    {[ex.muscle, ex.level].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {visible < filtered.length && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setVisible(v => v + PAGE_SIZE)}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-white/[0.06] border border-white/15 hover:bg-white/[0.1] hover:border-[var(--color-primary)]/40 transition"
              >
                Show more ({filtered.length - visible} more)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
