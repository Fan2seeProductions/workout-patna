// Apple-style scroll-scrubbed cinematic hero.
//
// The section is 500vh tall; a sticky full-screen stage pins while the user
// scrolls, and scroll progress drives (1) the hero video's currentTime —
// frame-by-frame scrubbing, no autoplay — and (2) five narrative chapters
// (Workout → Nutrition → Recovery → Progress → Dashboard) that cross-fade
// in sync.
//
// Asset contract: drop the generated film at /public/hero/hero.mp4 (16:9,
// ~7s, muted). Until that file exists — or if it ever fails to load — the
// stage renders a pure-CSS black/red "energy" backdrop instead, so this is
// production-safe with or without the video. Poster: /public/hero/poster.jpg
// (optional).
//
// prefers-reduced-motion: no pinning, no scrub, no pulse — a single static
// screen with the tagline and CTA.
//
// No animation libraries: one passive scroll listener + rAF, compositing
// only via opacity/transform, so the main thread stays idle while scrubbing.
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type Chapter = {
  eyebrow: string
  title: string
  sub: string
}

const CHAPTERS: Chapter[] = [
  {
    eyebrow: "Today's workout",
    title: 'One workout.\nBuilt for today.',
    sub: 'Delivered every morning. Sets, reps, and time — decided for you.',
  },
  {
    eyebrow: 'Nutrition',
    title: 'Fuel to match\nthe work.',
    sub: 'Meal and hydration cues tuned to what you trained today.',
  },
  {
    eyebrow: 'Recovery',
    title: 'Rest is\nprogrammed too.',
    sub: 'Sore, short on sleep, traveling? Tomorrow adapts automatically.',
  },
  {
    eyebrow: 'Progress',
    title: 'Strength you\ncan see.',
    sub: 'Streaks, PRs, and trends — tracked without a spreadsheet.',
  },
  {
    eyebrow: 'Your dashboard',
    title: 'Your AI Trainer.\nBuilt Around You.',
    sub: 'One coach. Every day. 14 days free — no card.',
  },
]

const SCROLL_LENGTH_VH = 500 // total scroll distance that drives the scrub

export function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([])
  const progressRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const [reducedMotion, setReducedMotion] = useState(false)
  const [videoOk, setVideoOk] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Scroll → progress → (video scrub + chapter cross-fade), all inside rAF.
  useEffect(() => {
    if (reducedMotion) return

    const update = () => {
      rafRef.current = null
      const el = containerRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0
      progressRef.current = p

      // 1. Scrub the film
      const v = videoRef.current
      if (v && videoOk && v.duration && Number.isFinite(v.duration)) {
        const t = p * Math.max(0, v.duration - 0.05)
        // Skip micro-seeks; readyState guard avoids seek-thrash while buffering
        if (v.readyState >= 2 && Math.abs(v.currentTime - t) > 0.02) {
          v.currentTime = t
        }
      }

      // 2. Cross-fade chapters
      const n = CHAPTERS.length
      const pos = p * (n - 1) // 0 .. n-1 as a float
      chapterRefs.current.forEach((node, i) => {
        if (!node) return
        const d = Math.abs(pos - i)
        const opacity = Math.max(0, 1 - d * 1.6)
        const translate = (pos - i) * -34 // drift up as it leaves
        node.style.opacity = String(opacity)
        node.style.transform = `translateY(${translate}px)`
        node.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none'
      })
    }

    const onScroll = () => {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [reducedMotion, videoOk])

  // ── Reduced motion: one calm screen, no pin, no scrub ────────────────
  if (mounted && reducedMotion) {
    const closer = CHAPTERS[CHAPTERS.length - 1]
    return (
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#0d0d0d]">
        <EnergyBackdrop still />
        <div className="relative text-center px-6 max-w-3xl mx-auto">
          <p className="text-[12px] uppercase tracking-[0.22em] font-bold text-[#ff4444] mb-6">{closer.eyebrow}</p>
          <h1 className="text-[44px] sm:text-[72px] font-black leading-[0.98] tracking-tight whitespace-pre-line">{closer.title}</h1>
          <p className="mt-6 text-[17px] sm:text-[20px] text-white/65 leading-relaxed">{closer.sub}</p>
          <HeroCtas className="mt-10 justify-center" />
        </div>
      </section>
    )
  }

  // ── Full cinematic scrub ─────────────────────────────────────────────
  return (
    <section ref={containerRef} className="relative" style={{ height: `${SCROLL_LENGTH_VH}vh` }} aria-label="WorkoutPartna — your AI trainer, built around you">
      {/* Keyboard/screen-reader escape hatch past the pinned stage */}
      <a
        href="#after-hero"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-full focus:text-sm focus:font-bold"
      >
        Skip intro
      </a>

      <div className="sticky top-0 h-screen overflow-hidden bg-[#0d0d0d]">
        {/* Film layer — silently absent until /hero/hero.mp4 ships */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: videoOk ? 1 : 0, transition: 'opacity 600ms ease' }}
          src="/hero/hero.mp4"
          poster="/hero/poster.jpg"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedMetadata={() => setVideoOk(true)}
          onError={() => setVideoOk(false)}
        />

        {/* CSS energy backdrop — the stage's look until (and beneath) the film */}
        {!videoOk && <EnergyBackdrop />}

        {/* Legibility scrims */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(13,13,13,0.55) 100%)' }} />
        <div className="absolute bottom-0 inset-x-0 h-36" style={{ background: 'linear-gradient(to top, #0d0d0d, transparent)' }} />

        {/* Chapter overlays */}
        {CHAPTERS.map((c, i) => {
          const isCloser = i === CHAPTERS.length - 1
          const Heading = i === 0 ? 'h1' : 'h2'
          return (
            <div
              key={c.eyebrow}
              ref={el => { chapterRefs.current[i] = el }}
              className="absolute inset-0 flex items-center justify-center px-6"
              style={{ opacity: i === 0 ? 1 : 0, willChange: 'opacity, transform' }}
            >
              <div className="text-center max-w-3xl mx-auto">
                <p className="text-[12px] uppercase tracking-[0.22em] font-bold text-[#ff4444] mb-6">{c.eyebrow}</p>
                <Heading className="text-[42px] sm:text-[68px] lg:text-[80px] font-black leading-[0.98] tracking-tight whitespace-pre-line">
                  {c.title}
                </Heading>
                <p className="mt-6 text-[16px] sm:text-[19px] text-white/65 leading-relaxed max-w-xl mx-auto">{c.sub}</p>
                {isCloser && <HeroCtas className="mt-10 justify-center" />}
                {i === 0 && (
                  <div className="mt-12 flex flex-col items-center gap-2 text-white/40" aria-hidden="true">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold">Scroll</span>
                    <span className="block h-9 w-[1.5px] bg-gradient-to-b from-white/50 to-transparent" />
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Persistent conversion escape — always reachable without finishing the film */}
        <div className="absolute bottom-5 inset-x-0 flex justify-center">
          <Link
            href="/app/signup"
            className="h-10 px-5 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur text-[13px] font-bold text-white/85 inline-flex items-center gap-2 hover:bg-white/[0.14] transition"
          >
            Start My Free 14 Days
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

/** Primary + secondary CTAs used by the closer chapter and reduced-motion view. */
function HeroCtas({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <Link
        href="/app/signup"
        className="h-14 px-8 rounded-full text-white font-black text-[16px] inline-flex items-center gap-2 shadow-[0_8px_32px_-4px_rgba(220,22,22,0.6)] transition hover:scale-[1.03] active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #b91010 0%, #dc1616 100%)' }}
      >
        Start My Free 14 Days
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </Link>
      <Link
        href="/app/signin"
        className="h-14 px-8 rounded-full border border-white/20 bg-white/[0.06] font-bold text-[16px] inline-flex items-center hover:bg-white/[0.1] transition"
      >
        I already have an account
      </Link>
    </div>
  )
}

/**
 * Pure-CSS stand-in for the film: black canvas with breathing red energy.
 * Also the graceful fallback if the video 404s or fails to decode.
 */
function EnergyBackdrop({ still = false }: { still?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 30% 60%, rgba(220,22,22,0.28) 0%, transparent 60%),' +
            'radial-gradient(50% 45% at 72% 35%, rgba(255,68,68,0.16) 0%, transparent 65%),' +
            'radial-gradient(90% 70% at 50% 50%, rgba(220,22,22,0.10) 0%, transparent 75%), #0b0b0b',
          animation: still ? undefined : 'wp-hero-pulse 5.5s ease-in-out infinite',
        }}
      />
      {/* faint fiber strands */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          background:
            'repeating-linear-gradient(115deg, transparent 0px, transparent 22px, rgba(255,68,68,0.35) 23px, transparent 25px)',
          maskImage: 'radial-gradient(70% 60% at 50% 55%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 55%, black 20%, transparent 75%)',
        }}
      />
      <style>{`@keyframes wp-hero-pulse { 0%, 100% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.04); filter: brightness(1.25); } }`}</style>
    </div>
  )
}
