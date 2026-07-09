// WorkoutPartna logo. The PNG at /public/logo.png is the square WP mark
// (red W → white P with a pulse bolt, on the brand's #0d0d0d black). The
// wordmark and tagline render as real text so they stay crisp at any size.

type LogoProps = {
  size?: number
  withWordmark?: boolean
  withTagline?: boolean
  vertical?: boolean
  className?: string
  light?: boolean // unused, kept for API compatibility
}

export function Logo({
  size = 40,
  withWordmark = false,
  withTagline = false,
  vertical = false,
  className = '',
}: LogoProps) {
  const showText = withWordmark || withTagline

  return (
    <span
      className={`inline-flex items-center ${vertical ? 'flex-col' : ''} ${className}`}
      style={{ gap: size * 0.28, lineHeight: 1 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="WorkoutPartna"
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          borderRadius: Math.max(4, size * 0.22),
          display: 'block',
        }}
      />
      {showText && (
        <span
          className={`flex flex-col justify-center ${vertical ? 'items-center' : ''}`}
          style={{ lineHeight: 1.1 }}
        >
          <span
            className="font-display font-extrabold tracking-tight text-white whitespace-nowrap"
            style={{ fontSize: size * 0.48 }}
          >
            Workout<span className="text-[var(--color-primary)]">Partna</span>
          </span>
          {withTagline && (
            <span
              className="font-semibold uppercase text-white/50 whitespace-nowrap"
              style={{ fontSize: size * 0.2, letterSpacing: '0.22em', marginTop: size * 0.06 }}
            >
              AI Daily Coach
            </span>
          )}
        </span>
      )}
    </span>
  )
}
