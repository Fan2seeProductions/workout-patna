// Line icon set for the app. Inline SVG, currentColor stroke.
import type { SVGProps } from 'react'

const base = (p: SVGProps<SVGSVGElement>) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...p,
})

export const StrengthIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12" />
  </svg>
)

export const RunIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="14" cy="4.5" r="1.6" />
    <path d="M5 21l3-5 3 1 1-4 3 3 4-1" />
    <path d="M9 12l2-3 4 1 2 4" />
  </svg>
)

export const FlameIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 2c2 4-2 6 0 9 2-1 3-3 3-3 1 2 2 4 2 6a5 5 0 1 1-10 0c0-2.5 2-4.5 2-7 1 1 2 2 3 0z" />
  </svg>
)

export const YogaIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="5" r="1.8" />
    <path d="M12 7v5M5 11l7 1 7-1M9 21l3-9 3 9" />
  </svg>
)

export const HeartPulseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3.5 12h3l2-3 3 6 2-4h7" />
    <path d="M21 12c0 4-9 9-9 9s-9-5-9-9" />
  </svg>
)

export const ScaleIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3 8h18M12 4v4M6 8l-3 7a3 3 0 0 0 6 0L6 8zM18 8l-3 7a3 3 0 0 0 6 0L18 8zM6 21h12" />
  </svg>
)

export const LegIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M9 3l1 7-2 6 2 5h3l1-5 2-6V3" />
  </svg>
)

export const ArmIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 7c2-2 5-2 7 0l3 3c2 2 2 5 0 7l-2 2-3-3 2-2-3-3-4 4-3-3 3-5z" />
  </svg>
)

export const TargetIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
)

export const BellIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
)

export const ChatIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

export const BrainIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3 3 3 0 0 0 3-1 3 3 0 0 0 3 1 3 3 0 0 0 3-3 3 3 0 0 0 2-5 3 3 0 0 0-2-5 3 3 0 0 0-3-3 3 3 0 0 0-3 1 3 3 0 0 0-3-1z" />
    <path d="M12 7v13M9 11h3M15 11h-3" />
  </svg>
)

export const ArrowRightIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const CheckIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 12l5 5L20 6" />
  </svg>
)

export const SparkleIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
  </svg>
)

export const VerifiedIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 2l2.4 2 3.1-.4 1 3 2.5 1.9-1 3 1 3-2.5 1.9-1 3-3.1-.4L12 22l-2.4-2-3.1.4-1-3L3 15.5l1-3-1-3 2.5-1.9 1-3 3.1.4L12 2z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

export const MapPinIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

export const ClockIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

export const BackIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)

export const MoreIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </svg>
)
