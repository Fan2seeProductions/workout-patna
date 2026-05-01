// Selectable card used across onboarding steps. Toggles a checked state.
'use client'

import type { ReactNode } from 'react'
import { CheckIcon } from './icons'

export function SelectCard({
  selected,
  onClick,
  icon,
  title,
  subtitle,
}: {
  selected: boolean
  onClick: () => void
  icon?: ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex items-center gap-3 w-full text-left p-3.5 rounded-2xl border transition active:scale-[0.99] ${
        selected
          ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10'
          : 'border-[var(--color-border)] bg-white/[0.03] hover:border-[var(--color-border-bright)]'
      }`}
    >
      {icon && (
        <div
          className={`shrink-0 h-11 w-11 rounded-xl flex items-center justify-center transition ${
            selected
              ? 'bg-[var(--color-brand)]/20 text-[var(--color-brand-bright)]'
              : 'bg-white/[0.04] text-white/70'
          }`}
        >
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[14px] text-white">{title}</p>
        {subtitle && (
          <p className="mt-0.5 text-[12px] text-[var(--color-text-muted)] leading-snug">
            {subtitle}
          </p>
        )}
      </div>
      <span
        className={`shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition ${
          selected
            ? 'border-[var(--color-brand)] bg-[var(--color-brand)]'
            : 'border-white/20'
        }`}
      >
        {selected && <CheckIcon width={12} height={12} className="text-white" />}
      </span>
    </button>
  )
}
