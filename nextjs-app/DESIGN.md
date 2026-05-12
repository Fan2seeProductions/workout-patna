---
version: alpha
name: WorkoutPartna
description: A black-canvas athletic brand for a workout-partner discovery + AI daily-coach platform. The base canvas is **deep black** (`#0d0d0d`) holding white display type, with surfaces lifted by translucent white overlays (`rgba(255,255,255,0.04)`) instead of solid lighter cards — this gives the dark UI its layered, almost glassmorphic depth without breaking the black voltage. The single brand color is **Workout Red** (`#dc1616`), used as a controlled voltage on primary CTAs, focus rings, eyebrows, and a 135° red linear gradient (`brand-gradient`) reserved for the strongest action surfaces. Premium membership is signaled with a soft amber accent (`+1` star pill), the only place the design system breaks from red. Type runs **Poppins** for display headlines (extrabold, tight tracking) and **Inter** for body — the visual feels closer to athletic apparel marketing (Nike, Whoop) than to social-app candy. Components prefer **fully-rounded pill shapes** for buttons and tags, **2xl rounded cards** for content blocks, and **circular icon buttons** for navigation affordances. The signature visual signature is the **brand-gradient red CTA pill against pure black**, often paired with a subtle red glow shadow.

colors:
  # Voltage / brand
  primary: "#dc1616"
  primary-darker: "#b91010"        # gradient start
  primary-lighter: "#ff4444"       # gradient end / hover-glow
  primary-active: "#a31010"
  primary-foreground: "#ffffff"

  # Ink (text)
  ink: "#f5f5f5"                   # foreground / display
  ink-strong: "#ffffff"            # strongest white for headlines on photo overlays
  body: "#f5f5f5"
  body-soft: "#d4d4d4"             # text-white/85
  muted: "#8c8c8c"                 # muted-foreground (was 55%, now standard)
  muted-soft: "#999999"             # text-dim (was 40%, bumped to 60% for AA)
  muted-stronger: "#a3a3a3"         # text-white/65 used on long body copy
  on-primary: "#ffffff"
  on-dark: "#ffffff"

  # Canvas / surfaces
  canvas: "#0d0d0d"                # body bg
  canvas-elevated: "#141414"        # card-section bg variant
  canvas-card: "#171717"            # var(--color-card)
  canvas-input: "#1a1a1a"           # form-input bg (the "wp-input" utility)
  canvas-muted: "#212121"           # var(--color-muted)
  surface-soft:    "rgba(255,255,255,0.04)"  # default card / pill bg
  surface-medium:  "rgba(255,255,255,0.06)"  # hover state for surface-soft
  surface-strong:  "rgba(255,255,255,0.08)"  # double-hover / active

  # Hairlines (borders)
  hairline:        "rgba(255,255,255,0.10)"  # default border
  hairline-strong: "rgba(255,255,255,0.15)"  # pill-button border
  hairline-soft:   "rgba(255,255,255,0.06)"  # divider inside cards

  # Brand-tinted surfaces (red voltage at low opacity)
  surface-primary-soft: "rgba(220,22,22,0.06)"   # promo banner backdrop
  surface-primary:      "rgba(220,22,22,0.12)"   # active red pill bg
  surface-primary-hover:"rgba(220,22,22,0.18)"
  border-primary-soft:  "rgba(220,22,22,0.30)"   # subtle red outlines
  border-primary:       "rgba(220,22,22,0.40)"

  # Premium (amber accent — only used for the +1 Guest badge)
  accent-amber:        "#fbbf24"
  accent-amber-glow:   "rgba(251,191,36,0.20)"
  accent-amber-border: "rgba(251,191,36,0.40)"
  accent-amber-text:   "#fde68a"

  # Semantic
  success:        "#22c55e"
  success-soft:   "rgba(34,197,94,0.10)"
  success-border: "rgba(34,197,94,0.30)"
  destructive:        "#ef4444"
  destructive-soft:   "rgba(239,68,68,0.10)"
  destructive-border: "rgba(239,68,68,0.30)"
  warning:        "#fbbf24"
  warning-soft:   "rgba(251,191,36,0.10)"
  info:           "#3b82f6"

typography:
  # Display: Poppins. Used for headlines, hero titles, brand wordmark. Always extrabold.
  display-mega:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: 88px        # hero h1 on /app and / splash
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: -2px
  display-xl:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: 52px        # marketing pages h1
    fontWeight: 900
    lineHeight: 1
    letterSpacing: -1.5px
  display-lg:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: 36px        # in-app section headings
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: -0.5px
  display-md:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: 28px        # /app/coach + /app/profile name
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.3px
  display-sm:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: 24px        # form step titles
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: -0.2px

  # Title (sub-display): for card headlines, banner titles
  title-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 800
    lineHeight: 1.3
  title-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.35
  title-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.4

  # Body
  body-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 14px        # default body
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  body-xs:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5

  # Label (UI chrome)
  label-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1
    textTransform: "uppercase"
    letterSpacing: "0.08em"   # tracking-wider
  label-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1
    textTransform: "uppercase"
    letterSpacing: "0.1em"
  label-xs:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 10px
    fontWeight: 800
    lineHeight: 1
    textTransform: "uppercase"
    letterSpacing: "0.12em"

  # Mono (numbers, codes, stats)
  mono:
    fontFamily: "'SF Mono', Monaco, Menlo, monospace"
    fontSize: 13px
    fontWeight: 500
    letterSpacing: "0.02em"

  # Font feature settings
  # Inter should be loaded with these feature flags for the sharpest rendering.
  # Without these, Inter renders as "plain Inter" rather than the polished in-app feel.
  inter-features: '"calt", "kern", "liga"'
  # Note: Unlike Raycast (ss03), WorkoutPartna does NOT enable ss03 — it alters the
  # single-story 'a' which clashes with Poppins display glyphs sharing the same page.

spacing:
  # 4px base ladder. Anything finer than 4px breaks the rhythm.
  xxs:  4px       # micro gaps
  xs:   8px       # default gap between inline pills
  sm:   12px      # tight stack
  md:   16px      # default block padding
  lg:   20px      # card internal padding
  xl:   24px      # section vertical rhythm
  xxl:  32px      # page padding (mobile)
  xxxl: 48px      # page padding (desktop) / large section gaps
  mega: 64px      # hero block margins

radii:
  # WorkoutPartna goes round — square corners are reserved for inputs only.
  none:      0
  sm:        8px      # rare, only for code blocks / inputs in some legacy spots
  md:        12px     # form inputs — class "wp-input"
  lg:        16px     # rounded-2xl style cards
  xl:        24px     # rounded-3xl — large feature cards / modals
  pill:      9999px   # ALL buttons, pills, badges, avatars
  circle:    50%      # icon buttons (back arrow, dismiss x)

shadows:
  # WorkoutPartna uses red glows for brand moments and pure-black drops for elevation.
  # Cards use NO drop-shadow by default — depth comes from the surface ladder, not shadows.
  # Shadows appear only on the primary CTA (glow) and modals (deep dropshadow).
  glow-brand:    "0 8px 32px -4px rgba(220,22,22,0.6)"     # primary CTA hover
  glow-brand-sm: "0 4px 16px -2px rgba(220,22,22,0.5)"     # smaller CTA
  card-deep:     "0 24px 64px -12px rgba(0,0,0,0.5)"       # raised modal / bottom sheet
  card-soft:     "0 8px 24px -8px rgba(0,0,0,0.3)"         # standard card hover (rare)

elevation:
  # Depth is created entirely by the surface-color ladder — NOT by drop-shadows.
  # (Raycast-pattern: each notch lighter on the dark scale reads as one step closer to the viewer.)
  #
  # Level 0 — flat:         canvas (#0d0d0d)             Page background, footer, hero
  # Level 1 — soft card:    surface-soft (rgba wh 4%)    Default cards, pills, rows
  # Level 2 — medium card:  surface-medium (rgba wh 6%)  Hover state for level-1 surfaces
  # Level 3 — strong card:  surface-strong (rgba wh 8%)  Active/pressed state; tab-strip bg
  # Level 4 — elevated:     canvas-card (#171717)        Modals, bottom sheets, dropdowns
  #
  # Rule: never use a drop-shadow where a surface-color step can do the same job.
  # Exception: the primary CTA pill gets glow-brand on hover — red glow is brand voltage, not structural elevation.

motion:
  # Short, snappy, never bouncy. Athletic = decisive, not playful.
  # All interactions resolve in ≤300ms. Nothing eases in slowly.
  duration-fast: 150ms      # hover background color, focus ring
  duration-base: 200ms      # page enter, scale presses
  duration-slow: 300ms      # modal open/close, sheet slide
  easing-default: "cubic-bezier(0.4, 0, 0.2, 1)"   # tailwind default (ease-in-out)
  easing-decel:   "cubic-bezier(0, 0, 0.2, 1)"     # ease-out — for things arriving on screen
  easing-accel:   "cubic-bezier(0.4, 0, 1, 1)"     # ease-in — for things leaving screen

  # Surface-lift interaction model (Raycast-pattern)
  # Cards and pills do NOT translate or scale on hover.
  # Instead the background color lifts one notch on the surface ladder:
  #   surface-soft → surface-medium (hover)
  #   surface-medium → surface-strong (active)
  # This keeps the UI calm and athletic. No card "popping" or float effects.

  # Named motion patterns
  hover-surface:   "background-color 150ms cubic-bezier(0.4,0,0.2,1)"   # surface lift
  hover-scale:     "transform 200ms cubic-bezier(0.4,0,0.2,1)"          # CTA active:scale-[0.98]
  page-enter:      "opacity 200ms ease-out, transform 200ms ease-out"
  modal-enter:     "opacity 200ms ease-out, transform 300ms ease-out"    # translateY(8px) → 0
  glow-appear:     "box-shadow 150ms ease"                               # CTA glow on hover

components:
  # ────────────────────────────────────────────────────────────────
  # Buttons — all pills (rounded-full). Three voltages.
  # ────────────────────────────────────────────────────────────────
  button-primary:
    description: "Primary action. Red linear-gradient pill with white text and red glow."
    background: "linear-gradient(135deg, #b91010 0%, #dc1616 100%)"   # var(--brand-gradient)
    color: "ink-strong"
    radius: "pill"
    height: "44px (h-11)"
    paddingX: "24px (px-6)"
    fontWeight: 800
    fontSize: 15px
    boxShadow: "glow-brand"
    activeTransform: "scale(0.98)"
    disabledOpacity: 0.5
    examples:
      - "Find My Partna"
      - "Subscribe to Coach"
      - "Submit & start coaching"
      - "Continue"
  button-secondary:
    description: "Secondary action. Translucent pill with hairline border."
    background: "surface-soft"
    color: "body-soft"
    border: "1px solid hairline-strong"
    radius: "pill"
    height: "44px"
    paddingX: "24px"
    fontWeight: 700
    fontSize: 13px
    hoverBackground: "surface-medium"
  button-ghost:
    description: "Tertiary, minimal — used for Cancel / Dismiss."
    background: "transparent"
    color: "muted"
    fontWeight: 600
    hoverColor: "body-soft"
  button-icon-circle:
    description: "Circular icon-only button. Used for back arrows, dismiss × on banners."
    background: "surface-soft"
    border: "1px solid hairline"
    color: "body-soft"
    radius: "circle"
    size: "36px (h-9 w-9)"
    iconSize: "18px"

  # ────────────────────────────────────────────────────────────────
  # Pills (selection chips) — used in onboarding, intake, filters.
  # ────────────────────────────────────────────────────────────────
  pill-active:
    description: "Selected state. Red voltage."
    background: "surface-primary"
    border: "1px solid border-primary"
    color: "primary"
    fontWeight: 700
  pill-inactive:
    description: "Unselected state. Translucent on dark."
    background: "surface-soft"
    border: "1px solid hairline-strong"
    color: "body-soft"
    fontWeight: 500
    hoverBackground: "surface-medium"
    hoverColor: "ink-strong"

  # ────────────────────────────────────────────────────────────────
  # Cards
  # ────────────────────────────────────────────────────────────────
  card-default:
    description: "Standard content card. Translucent on dark canvas."
    background: "surface-soft"
    border: "1px solid hairline"
    radius: "lg"
    padding: "20px"
    hoverBackground: "surface-medium"
  card-feature:
    description: "Larger, more prominent (e.g., AI Coach pricing card)."
    background: "canvas-card"
    border: "1px solid hairline-strong"
    radius: "xl"
    padding: "24px"
    boxShadow: "card-deep"
  card-promo-banner:
    description: "AI Coach cross-page banner. Soft red voltage."
    background: "linear-gradient(to right, surface-primary, surface-primary-soft, transparent)"
    border: "1px solid border-primary-soft"
    radius: "lg"

  # ────────────────────────────────────────────────────────────────
  # Inputs — single rounded-md style. Dark fill, white text.
  # ────────────────────────────────────────────────────────────────
  input:
    description: "Text/number/email/tel input. Dark surface, white text, red focus ring."
    background: "canvas-input"          # #1a1a1a
    border: "1px solid hairline"        # rgba(255,255,255,0.10)
    color: "ink"
    placeholderColor: "muted-soft"
    radius: "md"
    height: "44px"
    paddingX: "14px"
    fontSize: 14px
    focusBorder: "primary"
    focusRing: "1px solid primary"
    caretColor: "ink"

  textarea:
    extends: "input"
    minHeight: "80px"
    resize: "none"
    paddingY: "12px"

  select:
    extends: "input"
    appearance: "menulist"

  # ────────────────────────────────────────────────────────────────
  # Avatars
  # ────────────────────────────────────────────────────────────────
  avatar-sm:
    radius: "circle"
    size: "32px"
    border: "2px solid canvas"
    fallback: "Single uppercase initial, brand-gradient bg, white text"
  avatar-md:
    radius: "circle"
    size: "48px"
    border: "2px solid canvas"
  avatar-lg:
    radius: "circle"
    size: "96px"
    border: "4px solid canvas"

  # ────────────────────────────────────────────────────────────────
  # Badges
  # ────────────────────────────────────────────────────────────────
  badge-premium:
    description: "Amber +1 Guest badge for premium members. Only place amber appears."
    background: "linear-gradient(to right, accent-amber-glow, rgba(251,191,36,0.15), rgba(251,191,36,0.10))"
    border: "1px solid accent-amber-border"
    color: "accent-amber-text"
    icon: "★ (custom SVG, not lucide)"
    radius: "pill"
    fontWeight: 700
    textTransform: "uppercase"
    sizes:
      sm:
        height: "20px"
        paddingX: "6px"
        fontSize: "10px"
        label: "+1"
      md:
        height: "28px"
        paddingX: "10px"
        fontSize: "12px"
        label: "Premium · +1 Guest"
  badge-status:
    description: "Generic status pill (active, pending, etc)"
    background: "surface-soft"
    border: "1px solid hairline-strong"
    color: "body-soft"
    fontSize: "11px"
    textTransform: "uppercase"

  # ────────────────────────────────────────────────────────────────
  # Forms / multi-step
  # ────────────────────────────────────────────────────────────────
  step-progress:
    description: "Top-of-form progress bar — N pills, filled left-to-right with primary color."
    pillHeight: "4px (h-1)"
    pillRadius: "pill"
    activeColor: "primary"
    inactiveColor: "rgba(255,255,255,0.10)"
    gap: "6px (gap-1.5)"

  field-label:
    typography: "label-md"
    color: "muted"
    marginBottom: "8px (mb-2)"

  # ────────────────────────────────────────────────────────────────
  # Navigation
  # ────────────────────────────────────────────────────────────────
  navbar-bottom:
    description: "Mobile bottom-tab navigation. Sticky bottom on mobile, top on desktop."
    background: "canvas"
    borderTop: "1px solid hairline"
    height: "80px (h-20) on mobile, top header on desktop"
    activeColor: "primary"
    inactiveColor: "muted"

  back-button:
    description: "Reusable circular icon button on top-left of deep pages."
    extends: "button-icon-circle"
    icon: "ChevronLeft / BackIcon"
    behavior: "router.back() if history.length > 1, else router.push(fallbackHref)"

  # ────────────────────────────────────────────────────────────────
  # Modals / Dialogs
  # ────────────────────────────────────────────────────────────────
  modal:
    background: "canvas-elevated"
    border: "1px solid hairline-strong"
    radius: "xl"
    padding: "32px"
    backdropBackground: "rgba(0,0,0,0.6) backdrop-blur-md"
    boxShadow: "card-deep"
    maxWidth: "560px"

voice-and-tone:
  # The verbal style that pairs with the visual.
  # Rule: maximum editorial energy in the copy, maximum restraint in the chrome.
  # (Nike-pattern: the photography speaks, the UI doesn't. Here: the person cards speak, the nav doesn't.)

  principles:
    - "Direct and athletic. No corporate hedging, no passive voice."
    - "Action verbs over descriptions. 'Find My Partna' not 'Browse our community.'"
    - "Houston-flavored, friendly, grounded. 'Partna' (informal spelling) is the brand word — never 'Partner.'"
    - "Numbers: spelled out only under 10 (per AP style). PRs, weights, miles, reps, days/week stay numeric."
    - "Empty states are encouraging — not pity. 'Tap to start chatting' beats 'No messages yet.'"
    - "Premium is a perk, never a paywall. 'Bring +1 to any gym' beats 'Upgrade to access.'"
    - "Coach AI copy matches the user's chosen tone (encouraging / tough / clinical). Never override it with system defaults."

  cta-copy-rules:
    # (Nike-pattern: the CTA label determines whether the button feels brand-correct.)
    # Verb first. Object second. Optional directional arrow (→) for navigation CTAs.
    - "Primary CTA: verb + noun. 'Find My Partna', 'Start Free Trial', 'Submit & Start Coaching'"
    - "Secondary CTA: undo/dismiss/escape. 'Back', 'Not Now', 'Dismiss'"
    - "Ghost/text: navigate or edit. 'Edit Profile', 'Skip for Now', 'View All'"
    - "Never label a red CTA 'Submit' — always give it a brand-flavored label."
    - "Arrow (→) on navigation CTAs only. Never on form submit buttons."

  microcopy-patterns:
    - "Section eyebrow labels: uppercase, 11px, muted, letter-spacing 0.1em. e.g. 'YOUR CONNECTIONS (3)'"
    - "Timestamp: short relative form. 'now', '3m', '2h', '4d'. Never 'just now' or '4 days ago'."
    - "Loading state copy: present-progressive. 'Finding partnas…' not 'Loading...'"
    - "Error state: apologize once, then fix. 'Couldn't send — try again →'"
    - "Premium upgrade nudge: benefit-first. 'Unlock Nearby Gyms' not 'Go Premium'."

responsive:
  # WorkoutPartna is mobile-first. The shell (/app/*) is a PWA-style layout;
  # marketing pages (/pricing, /for-gyms-apartments) gain desktop gutter.
  breakpoints:
    mobile:       "0–639px"    # Single column. Bottom-tab nav visible. Full-width cards."
    tablet:       "640–1023px" # 2-up card grids. Bottom-tab transitions to top header."
    desktop-sm:   "1024–1279px" # Max-width container (~640px centered). Side padding 24px."
    desktop:      "1280px+"     # Max-width ~768px centered. Side padding auto."

  # Section spacing adapts:
  #   mobile  → spacing.xl (24px) vertical gap between sections
  #   tablet  → spacing.xxl (32px)
  #   desktop → spacing.xxxl (48px)
  #
  # Grid collapses:
  #   Discover card grid:  2-up on mobile → 3-up on tablet → 4-up on desktop
  #   Matches list:        1-up always (people cards don't grid)
  #   Coach intake form:   full-width always (max-width 480px, centered on desktop)
  #
  # Photography art-direction:
  #   Hero splash: 16:9 wide on desktop → 4:5 portrait on mobile (focal point: upper body)
  #   Profile photo: 1:1 square crop at all sizes
  #   Cover photo overlay: hero text always on the LEFT, never center on desktop

photography:
  # Hero / marketing imagery direction.
  - "Real people training, slightly desaturated, cinematic contrast. Show effort — not perfection."
  - "Top-of-page hero uses splashHero asset with a 105° dark-left → transparent-right gradient so left-anchored white display type stays readable at all sizes."
  - "Bottom of every hero section fades to canvas (#0d0d0d) with a 160px linear gradient mask — photos never have a hard edge against page content."
  - "Avoid stock-fitness clichés: no smiling supplement ads, no pristine equipment, no gym-bro pose. Show real training, real sweat, real facility."
  - "Art direction for hero: 16:9 landscape on desktop → 4:5 portrait on mobile. Preserve the subject's upper body in the crop center."
  - "Profile photos are always 1:1 square, cropped to face + shoulders. The avatar fallback is a single uppercase initial on a brand-gradient circle."
  - "The dark canvas IS the design. When no photo is available, the absence of imagery should look intentional — a gradient or surface, never an empty white box."

iconography:
  - "Use Lucide icons (`lucide-react`) for utility — search, filters, x, chevron, etc."
  - "Custom inline SVGs for brand moments — the WP wordmark, the premium star, the coach 🤖 emoji."
  - "Stroke width 2.5 for action icons (CTA-prefix arrows), 2.0 for inline body icons."
  - "Never combine multiple icon sets — Lucide only for utility, custom only for brand."

accessibility:
  contrast:
    - "All body text passes WCAG AA on canvas (#0d0d0d). Verified by tests/e2e/contrast-audit.spec.ts."
    - "text-white/40 and below are NOT used for body — minimum is text-white/60."
    - "Decorative low-opacity numbers (e.g. text-white/[0.06]) MUST have aria-hidden='true'."
  focus:
    - "All inputs and buttons have a 1px primary-colored focus ring."
    - "Pills, cards, and back buttons get focus-visible:ring-2 ring-primary in custom flows."
  forms:
    - "Every input has an associated <label> (visible or sr-only)."
    - "Error states use destructive color + helper text underneath the input."
    - "Required-field indicators use a small red asterisk (*) with aria-required='true'."

brand-signatures:
  # The five things that make WorkoutPartna look like WorkoutPartna.
  - 1: "Black canvas with translucent-white surfaces (never solid grey cards)."
  - 2: "Red brand-gradient pill CTAs with red glow shadow against pure black."
  - 3: "Pill shapes everywhere — buttons, badges, tags, status indicators all rounded-full."
  - 4: "Poppins extrabold display + tight negative tracking — display-mega = -2px letter-spacing."
  - 5: "Amber +1 Guest premium badge — the only non-red voltage in the system."

# ────────────────────────────────────────────────────────────────
# Implementation notes (for AI coding agents)
# ────────────────────────────────────────────────────────────────
implementation:
  framework: "Next.js 15 App Router, React 19, TypeScript, Tailwind v4"
  tokens-source: "app/globals.css (CSS custom properties on :root)"
  utility-classes:
    description: "Six pre-built classes for common compositions. Prefer these over inlining."
    classes:
      - ".wp-input — full input style, paste on any <input>"
      - ".wp-card — surface-soft + hairline + radius-lg"
      - ".wp-pill-active — selected pill"
      - ".wp-pill-inactive — unselected pill"
      - ".wp-btn-primary — red gradient CTA"
      - ".wp-btn-secondary — translucent pill"
  reusable-components:
    - "components/app/PremiumBadge.tsx — premium star pill"
    - "components/app/AICoachPromoBanner.tsx — cross-page promo with state-aware copy"
    - "components/app/BackButton.tsx — circular icon button with router.back() + fallback"
  forbidden-patterns:
    - "Solid `bg-white` cards on dark pages (white-on-white text bug — use surface-soft instead)."
    - "Solid `text-gray-100`/`text-gray-200` on dark canvas (use ink or body)."
    - "Brand-gradient applied to text (use solid primary color instead)."
    - "Square buttons (radius < 9999px) — only inputs are square-ish."
    - "Lucide chevron-left for back buttons — use the BackButton component."
    - "Two primary (red gradient) CTAs in the same viewport block."
    - "Drop-shadow on standard cards — use the surface-color ladder for depth."
    - "Any non-amber accent color for premium indicators — amber is the only sanctioned non-red voltage."
    - "text-white/30 or lower for any readable text — minimum legible opacity is /60."

  do-and-dont:
    do:
      - "Use `surface-soft` (rgba white 4%) for all default card backgrounds on the dark canvas."
      - "Lift one surface notch on hover: surface-soft → surface-medium. No translate, no scale."
      - "Reserve red for the single primary CTA per screen, eyebrow labels, and focus rings."
      - "Keep amber exclusively for premium badges — it signals 'perk', not brand."
      - "Use pill shapes (rounded-full) for buttons, badges, tags, and status pills."
      - "Use BackButton component for all back-navigation — not an inline chevron."
      - "Use PremiumBadgeIf for all profile name display — it auto-hides when not premium."
      - "Apply `font-feature-settings: 'calt', 'kern', 'liga'` on Inter body text."
      - "Test every new text color against the canvas with contrast-audit.spec.ts."
    dont:
      - "Don't introduce a new accent color without updating DESIGN.md and globals.css."
      - "Don't animate cards with translate/float on hover — this app is athletic, not bubbly."
      - "Don't use `bg-white` on any in-app dark surface — it's the most common breakage pattern."
      - "Don't add a second red CTA to a screen that already has one — demote it to secondary."
      - "Don't use Lucide icons outside of utility chrome — use custom SVGs for brand moments."
      - "Don't apply brand-gradient to typography — it pixelates on sub-pixel renders."
      - "Don't add a drop-shadow to cards — use the surface-color ladder (elevation section above)."
      - "Don't break the pill rule for buttons without documenting the exception here."

  iteration-guide:
    # For AI coding agents and human devs extending this system.
    # (Nike-pattern adapted: work one component at a time, verify tokens resolve, don't invent new ones.)
    - "1. Work one component at a time. Check that every color, radius, and shadow value resolves to a token in this file or globals.css."
    - "2. Check the forbidden-patterns list before writing any new card or button — the most common bugs are already documented."
    - "3. New color needs? Add the token here AND in globals.css :root before using it. Never inline a hex that isn't a token."
    - "4. New component? Ask: can it be expressed with surface-soft + hairline + pill-radius + existing copy rules? If yes, don't add tokens — compose them."
    - "5. Before adding a new accent color, look at the premium badge: it's the only sanctioned non-red voltage and it exists for a specific semantic reason. New accents need the same justification."
    - "6. Test contrast after every new text/background combination. Run: `cd nextjs-app && npx playwright test tests/e2e/contrast-audit.spec.ts`"
    - "7. Copy changes: read voice-and-tone.cta-copy-rules before labeling any button. The label determines whether the button feels brand-correct."
    - "8. When a page 'feels too red,' pull red back — keep it only on the primary CTA, one eyebrow, and the focus ring. Everything else is white-on-black."
---

# WorkoutPartna Design System

> Read this file before generating any UI. It supersedes any general design intuition.
> **References:** Raycast (surface ladder, elevation model, interaction patterns) + Nike (editorial restraint, copy discipline, iteration rules).

WorkoutPartna is a **dark-canvas athletic platform** for finding workout partners and getting AI-personalized daily training. The interface should feel like high-performance athletic apparel marketing — confident, decisive, and a little raw — not like a SaaS dashboard.

## The voltage rule

Red is the brand voltage. **Use it sparingly.** The strongest screen has at most:
- 1 primary red gradient CTA
- 1 red eyebrow label
- 1 red focus ring on the active input

Everything else is white-on-black with translucent surfaces. If the page feels "too red" you've over-voltaged it. Pull red back to surfaces and accents.

## The three sizes of action

| Size | Use when | Example |
|---|---|---|
| **Primary CTA** (red gradient pill) | One per screen, the action everything else supports | "Subscribe to Coach", "Find My Partna" |
| **Secondary pill** (translucent + hairline border) | The escape hatch / undo / cancel | "Back", "Dismiss" |
| **Ghost text** (no background) | Tertiary navigation links | "Edit", "Skip" |

Never put two primary CTAs in the same viewport block.

## The pill rule

WorkoutPartna is a pill-shape brand. Buttons are pills. Badges are pills. Tags are pills. Status indicators are pills.

The only square things are **inputs** (`radius: md`) and **the splash hero photo wrapper**. Everything else gets `border-radius: 9999px`.

## The depth rule (no drop-shadows on cards)

WorkoutPartna builds depth the Raycast way — with the surface-color ladder, not drop-shadows.

| Distance from viewer | Surface token | Value |
|---|---|---|
| Background | `canvas` | `#0d0d0d` |
| Default card | `surface-soft` | `rgba(255,255,255,0.04)` |
| Hovered card | `surface-medium` | `rgba(255,255,255,0.06)` |
| Active/pressed | `surface-strong` | `rgba(255,255,255,0.08)` |
| Modal / sheet | `canvas-card` | `#171717` |

Cards don't float, translate, or scale on hover. They lift one color step. The only time a shadow appears is on the primary CTA pill (red glow) and modals (deep black drop). Anything else with a shadow is a mistake.

## The "chrome is nothing, people are everything" rule

The dark canvas exists to disappear. The person cards, workout posts, and profile photos are the content — they carry all the visual energy. Every piece of UI chrome should be as invisible as possible.

Applied: the bottom-tab nav is `canvas` (#0d0d0d) with hairline top border — not a glassy blur. Profile cards use `surface-soft` with no shadow — the avatar photo is the card decoration.

## The copy rule (Nike-adapted)

The CTA label determines whether the button feels brand-correct. A red pill labeled "Submit" is wasted voltage. The same pill labeled **"Find My Partna →"** is brand-correct.

Rule: **verb + object**. Direction arrow only on navigation CTAs.

| Wrong | Right |
|---|---|
| "Submit" | "Start Free Trial" |
| "Browse" | "Find My Partna →" |
| "Upgrade" | "Unlock Nearby Gyms" |
| "OK" | "Got It" |

## When to break the system

- **Use `bg-white` on light marketing pages** (`/pricing`, `/for-gyms-apartments`, `/business/apartments`, `/waiver` signature box). Those are intentionally light-themed sections inside dark-themed pages. Set explicit `text-gray-900` inside.
- **Use solid colors instead of translucent** when a card sits on top of an image (e.g., the auth page hero) — translucent surfaces don't read well over photography.
- **Use amber instead of red** for the premium badge. This is the only sanctioned non-red voltage — it signals "perk," not a brand-color collision.

## Voice + visual together

The brand only feels right when the visual + verbal click. Cross-check every CTA label against `voice-and-tone.cta-copy-rules` before shipping. If the label is a generic verb with no object, it's not brand-correct yet.
