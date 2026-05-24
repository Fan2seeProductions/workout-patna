// Gymverse-inspired library tab — workout category cards with filter chips.
'use client'

import { useState } from 'react'
import { Lock as LockIcon } from 'lucide-react'
import { SparkleIcon } from '../../../../components/app/icons'

type Category = {
  id: string
  title: string
  subtitle: string
  gradient: string
  exerciseCount: number
  locked: boolean
}

const CATEGORIES: Category[] = [
  { id: 'strength-lower', title: 'BUILD MUSCLE', subtitle: 'Lower Body', gradient: 'from-[#1E63E9]/60 to-[#1E63E9]/20', exerciseCount: 6, locked: false },
  { id: 'strength-upper', title: 'BUILD MUSCLE', subtitle: 'Upper Body Push', gradient: 'from-[#1E63E9]/60 to-[#22D3EE]/20', exerciseCount: 7, locked: false },
  { id: 'hypertrophy', title: 'HYPERTROPHY', subtitle: 'Full Body Split', gradient: 'from-[#7C3AED]/60 to-[#1E63E9]/20', exerciseCount: 8, locked: true },
  { id: 'endurance', title: 'ENDURANCE', subtitle: 'Aerobic Conditioning', gradient: 'from-[#22D3EE]/60 to-[#22D3EE]/10', exerciseCount: 5, locked: true },
  { id: 'lose-weight', title: 'LOSE WEIGHT', subtitle: 'Full Body Burn', gradient: 'from-[#1E63E9]/50 to-[#7C3AED]/20', exerciseCount: 7, locked: true },
  { id: 'mixed', title: 'CONDITIONING', subtitle: 'Mixed Modality', gradient: 'from-[#22D3EE]/50 to-[#1E63E9]/10', exerciseCount: 6, locked: false },
  { id: 'peloton', title: 'PELOTON', subtitle: 'Power Zone Intervals', gradient: 'from-[#EF4444]/55 to-[#F59E0B]/15', exerciseCount: 5, locked: false },
  { id: 'wfh', title: 'WORK FROM HOME', subtitle: 'No-Equipment Full Body', gradient: 'from-[#10B981]/55 to-[#22D3EE]/15', exerciseCount: 6, locked: false },
  { id: 'desk', title: 'DESK RESET', subtitle: 'Posture + Mobility', gradient: 'from-[#F59E0B]/50 to-[#7C3AED]/15', exerciseCount: 5, locked: false },
]

const FILTERS = ['All', 'Strength', 'Hypertrophy', 'Endurance', 'Mixed', 'Peloton', 'WFH', 'Desk']

export function LibraryTab() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered =
    activeFilter === 'All'
      ? CATEGORIES
      : CATEGORIES.filter((c) =>
          c.id.toLowerCase().includes(activeFilter.toLowerCase()) ||
          c.title.toLowerCase().includes(activeFilter.toLowerCase()),
        )

  return (
    <div className="space-y-5">
      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-[12px] font-bold whitespace-nowrap border transition ${
              activeFilter === f
                ? 'bg-[var(--color-brand)] border-[var(--color-brand)] text-white'
                : 'bg-white/[0.04] border-white/[0.08] text-white/60 hover:border-white/20'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Category cards */}
      <div className="space-y-4">
        {filtered.map((cat) => (
          <div
            key={cat.id}
            className={`relative rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-br ${cat.gradient} min-h-[140px] flex flex-col justify-end p-5`}
          >
            {/* Premium badge */}
            {cat.locked && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-[var(--color-accent)]/80 px-2.5 py-1 rounded-full">
                <SparkleIcon width={10} height={10} className="text-white" />
                <span className="text-[10px] font-extrabold text-white uppercase tracking-wider">
                  Premium
                </span>
              </div>
            )}

            {/* Decorative pattern */}
            <div className="absolute top-3 left-4 grid grid-cols-4 gap-1.5 opacity-30">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-white" />
              ))}
            </div>

            {/* Title block */}
            <div className="relative flex items-start gap-2">
              <div className="w-1 h-10 rounded-full bg-[var(--color-cyan)]" />
              <div>
                <h3 className="text-[18px] font-extrabold italic tracking-tight text-white">
                  {cat.title}
                </h3>
                <p className="text-[13px] text-white/70 font-medium">{cat.subtitle}</p>
              </div>
            </div>

            {/* Exercise count */}
            <div className="mt-2 ml-3">
              <span className="text-[11px] text-white/50 font-semibold">
                {cat.exerciseCount} exercises
              </span>
            </div>

            {/* Lock overlay */}
            {cat.locked && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <LockIcon width={28} height={28} className="text-white/40" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
