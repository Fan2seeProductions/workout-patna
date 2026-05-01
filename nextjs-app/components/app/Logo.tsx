// WorkoutPartna logo. Blue gradient WP mark with a swooshing P.
// Wordmark: "Workout" + "Partna" (Partna in brand blue).

type LogoProps = {
  size?: number
  withWordmark?: boolean
  className?: string
  light?: boolean // when true, "Workout" renders white instead of dark
}

export function Logo({ size = 40, withWordmark = false, className = '', light = true }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="WorkoutPartna"
      >
        <defs>
          <linearGradient id="wp-grad" x1="4" y1="14" x2="60" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%"  stopColor="#1E63E9" />
            <stop offset="55%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>

        {/* W: angled strokes meeting at center */}
        <path
          d="M6 14 L17 50 L26 28 L32 42 L32 14"
          stroke="url(#wp-grad)"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* P: vertical stem + swooshing top loop */}
        <path
          d="M34 50 L34 14 L48 14 C56 14 60 19 60 26 C60 33 56 38 48 38 L40 38"
          stroke="url(#wp-grad)"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {withWordmark && (
        <span className="font-extrabold tracking-tight text-[1.05em]">
          <span className={light ? 'text-white' : 'text-[#0f172a]'}>Workout</span>
          <span className="brand-gradient-text">Partna</span>
        </span>
      )}
    </div>
  )
}
