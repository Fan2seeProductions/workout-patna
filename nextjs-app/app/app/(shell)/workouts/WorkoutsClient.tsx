// Workouts library client. Body-part + level filters, expandable cards.
'use client'

import { useMemo, useState } from 'react'
import { Dumbbell, Clock, Filter, ChevronRight, Flame } from 'lucide-react'
import { cn } from '../../../../lib/utils'

export type WorkoutRow = {
  id: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced' | string
  body_part: string
  equipment: string | null
  duration: number | null
  instructions: string
  is_free: boolean
}

const bodyParts = ['All', 'chest', 'back', 'legs', 'glutes', 'core', 'arms', 'cardio', 'full_body'] as const
const levels = ['All', 'beginner', 'intermediate', 'advanced'] as const

const bodyPartLabels: Record<string, string> = {
  chest: 'Chest', back: 'Back', legs: 'Legs', glutes: 'Glutes',
  core: 'Core', arms: 'Arms', cardio: 'Cardio', full_body: 'Full Body',
}

const levelColors: Record<string, string> = {
  beginner:     'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced:     'bg-red-100 text-red-700',
}

export function WorkoutsClient({ workouts }: { workouts: WorkoutRow[] }) {
  const [bodyPart, setBodyPart] = useState<string>('All')
  const [level, setLevel] = useState<string>('All')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() => workouts.filter(w => {
    const partOk = bodyPart === 'All' || w.body_part === bodyPart
    const levelOk = level === 'All' || w.level === level
    return partOk && levelOk
  }), [workouts, bodyPart, level])

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pt-8 space-y-6 pb-24">
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-[var(--color-foreground)] flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          Free Workouts
        </h1>
        <p className="text-[var(--color-muted-foreground)]">
          Target specific muscle groups with our free workout library
        </p>
      </header>

      <div className="sticky top-0 bg-[var(--color-background)]/95 backdrop-blur-sm z-30 py-3 -mx-4 px-4 md:mx-0 md:px-0 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-muted-foreground)]">
          <Filter className="w-4 h-4" /> Body Part
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {bodyParts.map(part => (
            <button
              key={part}
              type="button"
              onClick={() => setBodyPart(part)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition border',
                bodyPart === part
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md'
                  : 'bg-white/[0.04] text-white/70 border-white/15 hover:border-[var(--color-primary)]/40 hover:bg-white/[0.08] hover:text-white',
              )}
            >
              {part === 'All' ? 'All' : bodyPartLabels[part] ?? part}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-muted-foreground)]">
          <Flame className="w-4 h-4" /> Level
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {levels.map(l => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition border capitalize',
                level === l
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-secondary)] shadow-md'
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
          <div className="w-16 h-16 bg-[var(--color-muted)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-[var(--color-muted-foreground)]" />
          </div>
          <h3 className="font-bold text-lg mb-2 text-[var(--color-foreground)]">No Workouts Found</h3>
          <p className="text-[var(--color-muted-foreground)] text-sm">
            Try adjusting your filters to see more workouts.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(w => {
            const open = expanded === w.id
            return (
              <div key={w.id} className="bg-white/[0.04] rounded-2xl border border-white/10 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : w.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--color-muted)]/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--color-foreground)]">{w.title}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full capitalize', levelColors[w.level] ?? 'bg-gray-100 text-gray-700')}>
                          {w.level}
                        </span>
                        <span className="text-xs text-[var(--color-muted-foreground)] capitalize">
                          {bodyPartLabels[w.body_part] ?? w.body_part}
                        </span>
                        {w.duration && (
                          <span className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {w.duration} min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={cn('w-5 h-5 text-[var(--color-muted-foreground)] transition-transform', open && 'rotate-90')} />
                </button>

                {open && (
                  <div className="px-4 pb-4 pt-2 border-t border-[var(--color-border)]/50 bg-[var(--color-muted)]/30">
                    <p className="text-sm text-[var(--color-muted-foreground)] mb-3">{w.description}</p>
                    <div className="text-sm mb-3 text-[var(--color-foreground)]">
                      <span className="font-bold">Equipment: </span>
                      <span className="text-[var(--color-muted-foreground)] capitalize">{w.equipment || 'None'}</span>
                    </div>
                    <div className="bg-white/[0.04] rounded-xl p-4 border border-white/10">
                      <h4 className="font-bold text-sm mb-2 text-[var(--color-foreground)]">Instructions</h4>
                      <div className="text-sm text-[var(--color-muted-foreground)] whitespace-pre-line">
                        {w.instructions}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
