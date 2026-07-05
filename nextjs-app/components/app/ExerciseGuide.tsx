// Illustrated exercise guide. Renders photo + step-by-step how-to cards for
// the exercises detected in today's workout text. Data is matched server-side
// (lib/exercises/match) and passed down already-serialized — this component
// never touches the 750 KB exercise database.
'use client'

import { useState } from 'react'

export type GuideItem = {
  id: string
  name: string
  level: string
  muscles: string[]
  imageUrls: string[]   // 1–2 photos: start + end position
  steps: string[]
}

export function ExerciseGuide({ items }: { items: GuideItem[] }) {
  if (!items.length) return null
  return (
    <section>
      <div className="flex items-center gap-2.5 mb-3 mt-1">
        <p className="text-[12px] uppercase font-bold tracking-wider text-white/70">
          How to do today&rsquo;s moves
        </p>
        <span className="text-[11px] font-bold text-white/40">{items.length} exercises</span>
      </div>
      <div className="space-y-2.5">
        {items.map(item => <GuideCard key={item.id} item={item} />)}
      </div>
      <p className="mt-2.5 text-[10.5px] text-white/35">
        Photos &amp; instructions from the open Free Exercise DB.
      </p>
    </section>
  )
}

function GuideCard({ item }: { item: GuideItem }) {
  const [open, setOpen] = useState(false)
  const [frame, setFrame] = useState(0)
  const hasTwoFrames = item.imageUrls.length > 1

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/[0.04] transition"
      >
        <div className="shrink-0 h-16 w-16 rounded-xl overflow-hidden bg-white border border-white/10">
          {item.imageUrls[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrls[0]}
              alt={item.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[14px] text-white truncate">{item.name}</p>
          <p className="text-[11.5px] text-white/50 capitalize truncate">
            {[item.muscles.slice(0, 2).join(', '), item.level].filter(Boolean).join(' · ')}
          </p>
        </div>
        <span
          aria-hidden
          className={`shrink-0 text-white/50 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="px-3 pb-4">
          {/* Large photo with start/end position toggle */}
          <div className="rounded-xl overflow-hidden bg-white border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrls[frame] ?? item.imageUrls[0]}
              alt={`${item.name} — ${frame === 0 ? 'start' : 'end'} position`}
              loading="lazy"
              className="w-full aspect-[853/567] object-cover"
            />
          </div>
          {hasTwoFrames && (
            <div className="mt-2 flex gap-2">
              {(['Start', 'Finish'] as const).map((label, idx) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setFrame(idx)}
                  className={`h-8 px-4 rounded-full text-[11.5px] font-bold transition ${
                    frame === idx
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-white/[0.06] text-white/60 border border-white/12'
                  }`}
                >
                  {label} position
                </button>
              ))}
            </div>
          )}

          <ol className="mt-3 space-y-2">
            {item.steps.map((step, idx) => (
              <li key={idx} className="flex gap-2.5 text-[13px] text-white/80 leading-relaxed">
                <span className="shrink-0 h-5 w-5 rounded-full bg-white/10 text-white/70 text-[11px] font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
