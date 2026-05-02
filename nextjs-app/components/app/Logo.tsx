// WorkoutPartna logo. Blue-to-violet gradient WP mark with a dumbbell icon
// inside the P. Wordmark: "workout" + "partna" (Partna in brand blue).
// Renders as inline SVG so it sits cleanly on any background, including dark.
//
// The full PNG asset at /public/logo.png is kept for OG image, app icon,
// and other surfaces where a white background is fine.

type LogoProps = {
  size?: number
  withWordmark?: boolean
  withTagline?: boolean
  vertical?: boolean
  className?: string
  light?: boolean // when true, "workout" renders white. Set false on light backgrounds.
}

export function Logo({
  size = 40,
  withWordmark = false,
  withTagline = false,
  vertical = false,
  className = '',
  light = true,
}: LogoProps) {
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="WorkoutPartna"
    >
      <defs>
        <linearGradient id="wp-grad" x1="10" y1="10" x2="70" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#22D3EE" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>

      <path
        d="M8 14 L20 64 L32 30 L40 56 L40 14"
        stroke="url(#wp-grad)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <path
        d="M40 14 L40 64 M40 14 L56 14 C66 14 72 21 72 31 C72 41 66 48 56 48 L48 48"
        stroke="url(#wp-grad)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <g stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" fill="#FFFFFF">
        <line x1="49" y1="31" x2="63" y2="31" strokeWidth="2.6" />
        <rect x="47" y="27" width="2.5" height="8" rx="0.6" />
        <rect x="50" y="25" width="2" height="12" rx="0.5" />
        <rect x="63" y="25" width="2" height="12" rx="0.5" />
        <rect x="65.5" y="27" width="2.5" height="8" rx="0.6" />
      </g>
    </svg>
  )

  const wordmark = (
    <span className={`font-extrabold tracking-tight ${vertical ? 'text-[1.5em] mt-2' : 'text-[1.05em]'}`}>
      <span className={light ? 'text-white' : 'text-[#0f172a]'}>workout</span>
      <span className="brand-gradient-text">partna</span>
    </span>
  )

  const tagline = (
    <span className={`block mt-1 text-[0.55em] font-semibold tracking-[0.2em] uppercase ${light ? 'text-white/65' : 'text-[#1e293b]/70'}`}>
      Match. Train. Grow. Together.
    </span>
  )

  if (vertical) {
    return (
      <div className={`inline-flex flex-col items-center ${className}`}>
        {mark}
        {withWordmark && wordmark}
        {withTagline && tagline}
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {mark}
      {withWordmark && (
        <div className="flex flex-col leading-none">
          {wordmark}
          {withTagline && tagline}
        </div>
      )}
    </div>
  )
}
