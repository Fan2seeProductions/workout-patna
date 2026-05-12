// Premium-member badge. Shown next to a user's name/bio anywhere in the app
// to signal they have a premium membership AND the +1 guest perk that comes
// with it. Hover (desktop) or tap (mobile) reveals a tooltip explaining
// what the badge means.

interface Props {
  /** Visual size — `sm` for inline next to a name, `md` for prominent placements */
  size?: 'sm' | 'md'
  /** Show only the icon, no text label (use in tight spaces like avatar overlays) */
  iconOnly?: boolean
  /** Custom class hook */
  className?: string
}

export function PremiumBadge({ size = 'sm', iconOnly = false, className = '' }: Props) {
  const sizeClasses =
    size === 'md'
      ? 'h-7 px-2.5 text-[12px] gap-1.5'
      : 'h-5 px-1.5 text-[10px] gap-1'

  const iconPx = size === 'md' ? 13 : 11

  return (
    <span
      title="Premium member — can bring +1 guest to any gym"
      aria-label="Premium member with +1 guest privilege"
      className={`inline-flex items-center rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-amber-300/10 text-amber-200 font-bold uppercase tracking-wider whitespace-nowrap ${sizeClasses} ${className}`}
    >
      {/* Sparkle / star icon */}
      <svg
        width={iconPx}
        height={iconPx}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="text-amber-300"
      >
        <path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 22 12 17.5 5.8 22l2.4-8.1L2 9.4h7.6L12 2z" />
      </svg>
      {!iconOnly && (
        <span className="leading-none">
          {size === 'md' ? 'Premium · +1 Guest' : '+1'}
        </span>
      )}
    </span>
  )
}

/**
 * Convenience wrapper that only renders the badge when `isPremium` is true.
 * Use this inline next to a user's name without conditional logic at every callsite.
 */
export function PremiumBadgeIf({
  isPremium,
  premiumUntil,
  size = 'sm',
  iconOnly = false,
  className = '',
}: Props & { isPremium: boolean | null | undefined; premiumUntil?: string | null }) {
  if (!isPremium) return null
  // If premium_until is in the past, the membership has lapsed — don't show.
  if (premiumUntil && new Date(premiumUntil).getTime() < Date.now()) return null
  return <PremiumBadge size={size} iconOnly={iconOnly} className={className} />
}
