// WorkoutPartna logo. Uses the transparent PNG asset at /public/logo.png.
// The PNG contains the full logo (WP mark + wordmark + tagline) on a square
// canvas with transparent background.

type LogoProps = {
  size?: number
  withWordmark?: boolean
  withTagline?: boolean
  vertical?: boolean
  className?: string
  light?: boolean // unused with PNG, kept for API compatibility
}

const ASPECT = 1 // PNG is square
const MARK_FRACTION = 0.55 // top portion of the PNG that contains the WP mark
const MARK_AND_WORDMARK_FRACTION = 0.85

export function Logo({
  size = 40,
  withWordmark = false,
  withTagline = false,
  className = '',
}: LogoProps) {
  // Decide which crop to show.
  // - mark only: top ~55% of the PNG
  // - mark + wordmark: top ~85%
  // - full (with tagline): 100%
  let cropFraction = MARK_FRACTION
  if (withTagline) cropFraction = 1
  else if (withWordmark) cropFraction = MARK_AND_WORDMARK_FRACTION

  // Render dimensions: width derived from `size` (interpreted as visual height
  // of the mark portion), then scaled up if more of the PNG is visible.
  const visibleHeight = size / MARK_FRACTION * cropFraction
  const renderHeight = size / MARK_FRACTION
  const renderWidth = renderHeight * ASPECT

  return (
    <span
      className={`inline-block overflow-hidden ${className}`}
      style={{ width: renderWidth, height: visibleHeight, lineHeight: 0 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="WorkoutPartna"
        width={renderWidth}
        height={renderHeight}
        style={{
          width: renderWidth,
          height: renderHeight,
          display: 'block',
        }}
      />
    </span>
  )
}
