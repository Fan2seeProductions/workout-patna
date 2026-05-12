// Full-screen Tinder/Bumble-style swipe deck for Discover.
// Touch-swipe on mobile, click buttons on desktop.
// Right swipe / heart = Connect request. Left swipe / X = Pass.
'use client'

import { useState, useRef, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X, RotateCcw, Star, Heart, Info, Zap } from 'lucide-react'
import { sendMatchRequest } from '../../../../lib/actions/matches'
import { sanitizePrompts, findPrompt } from '../../../../lib/profile/prompts'
import type { BrowseProfile } from './BrowseShell'

const FALLBACK = 'https://images.unsplash.com/photo-1572459815549-873917ec8c0a?w=600&h=900&fit=crop&q=80'

export function SwipeDeck({ profiles }: { profiles: BrowseProfile[] }) {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [history, setHistory] = useState<number[]>([])
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null)
  const [matchedName, setMatchedName] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  // Drag state
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)

  const current = profiles[index]
  const next    = profiles[index + 1]
  const after   = profiles[index + 2]

  // ── Advance ──────────────────────────────────────────────────────────
  function advance(dir: 'left' | 'right') {
    setSwipeDir(dir)
    setHistory(h => [...h, index])
    setTimeout(() => {
      setIndex(i => i + 1)
      setSwipeDir(null)
      setDragX(0)
    }, 280)
  }

  function pass() { if (index < profiles.length) advance('left') }

  function like() {
    if (!current) return
    advance('right')
    startTransition(async () => {
      try {
        const res = await sendMatchRequest(current.id)
        if (res.matched && res.matchId) {
          setMatchedName((current.display_name ?? '').split(' ')[0])
          setTimeout(() => {
            setMatchedName(null)
            router.push(`/app/messages/${res.matchId}`)
          }, 1800)
        }
      } catch { /* swallow */ }
    })
  }

  function rewind() {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setIndex(prev)
    setSwipeDir(null)
    setDragX(0)
  }

  // ── Touch handlers ────────────────────────────────────────────────────
  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    setDragging(true)
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!touchStart.current) return
    setDragX(e.touches[0].clientX - touchStart.current.x)
  }
  function onTouchEnd() {
    setDragging(false)
    touchStart.current = null
    if (Math.abs(dragX) > 90) dragX > 0 ? like() : pass()
    else setDragX(0)
  }

  // Mouse drag (desktop preview)
  function onMouseDown(e: React.MouseEvent) {
    const startX = e.clientX
    setDragging(true)
    function onMove(mv: MouseEvent) { setDragX(mv.clientX - startX) }
    function onUp(mu: MouseEvent) {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      setDragging(false)
      const dx = mu.clientX - startX
      if (Math.abs(dx) > 90) dx > 0 ? like() : pass()
      else setDragX(0)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  // ── Derived state ────────────────────────────────────────────────────
  const rotation  = dragging ? dragX / 18 : swipeDir === 'left' ? -18 : swipeDir === 'right' ? 18 : 0
  const tx        = dragging ? dragX : swipeDir === 'left' ? -480 : swipeDir === 'right' ? 480 : 0
  const likeAlpha = Math.min(1, Math.max(0, dragX / 90))
  const passAlpha = Math.min(1, Math.max(0, -dragX / 90))

  // ── Empty deck ───────────────────────────────────────────────────────
  if (index >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-20 w-20 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-3xl mb-4">🏋️</div>
        <p className="text-[16px] font-bold text-white">You've seen everyone!</p>
        <p className="mt-2 text-[13px] text-white/50">Check back later or invite friends to grow your gym community.</p>
        <button
          onClick={() => { setIndex(0); setHistory([]) }}
          className="mt-5 h-10 px-6 rounded-full brand-gradient text-white text-[13px] font-extrabold inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Start over
        </button>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center select-none">

      {/* ── Card stack ─────────────────────────────────────────────── */}
      <div className="relative w-full" style={{ height: '62dvh', maxHeight: 540, minHeight: 340 }}>

        {/* Card 3 — far back, barely peeking */}
        {after && (
          <div
            className="absolute inset-x-4 rounded-[28px] overflow-hidden bg-[#1a1a1a] border border-white/[0.06]"
            style={{ top: 10, bottom: -8, zIndex: 10, transform: 'scale(0.91)', transformOrigin: 'bottom center' }}
          />
        )}

        {/* Card 2 — middle, peeking */}
        {next && (
          <div
            className="absolute inset-x-2 rounded-[28px] overflow-hidden border border-white/[0.08]"
            style={{ top: 5, bottom: -4, zIndex: 20, transform: 'scale(0.95)', transformOrigin: 'bottom center' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={next.photo_url || FALLBACK} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}

        {/* Card 1 — front, interactive */}
        <div
          className="absolute inset-0 rounded-[28px] overflow-hidden shadow-2xl"
          style={{
            zIndex: 30,
            transform: `translateX(${tx}px) rotate(${rotation}deg)`,
            transition: dragging ? 'none' : 'transform 0.28s cubic-bezier(.25,.46,.45,.94), opacity 0.28s',
            opacity: swipeDir ? 0 : 1,
            cursor: 'grab',
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
        >
          {/* Full-bleed photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.photo_url || FALLBACK}
            alt={current.display_name ?? ''}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />

          {/* Top → bottom vignette (subtle) */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
          {/* Bottom heavy gradient */}
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

          {/* PARTNA! stamp */}
          <div
            className="absolute top-10 left-5 z-40 border-[3px] border-[var(--color-primary)] rounded-2xl px-4 py-2 pointer-events-none"
            style={{
              opacity: likeAlpha,
              transform: `rotate(-14deg)`,
              transition: 'none',
            }}
          >
            <p className="text-[var(--color-primary)] font-extrabold text-[22px] tracking-[0.15em]">PARTNA!</p>
          </div>

          {/* PASS stamp */}
          <div
            className="absolute top-10 right-5 z-40 border-[3px] border-white/70 rounded-2xl px-4 py-2 pointer-events-none"
            style={{
              opacity: passAlpha,
              transform: `rotate(14deg)`,
              transition: 'none',
            }}
          >
            <p className="text-white/80 font-extrabold text-[22px] tracking-[0.15em]">PASS</p>
          </div>

          {/* Top bar: gym badge (left) + info button (right) */}
          <div className="absolute inset-x-0 top-0 z-40 flex items-start justify-between px-4 pt-4 pointer-events-none">
            {current.gym?.name && (
              <div className="bg-black/55 backdrop-blur-md px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-white flex items-center gap-1.5">
                <span>🏋️</span>
                <span className="truncate max-w-[160px]">{current.gym.name}</span>
              </div>
            )}
            <Link
              href={`/app/profile/${current.id}`}
              className="ml-auto h-9 w-9 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center pointer-events-auto"
              onClick={e => e.stopPropagation()}
            >
              <Info className="w-4 h-4 text-white" />
            </Link>
          </div>

          {/* Bottom info */}
          <div className="absolute inset-x-0 bottom-0 z-40 px-5 pb-5 pointer-events-none">
            {/* Location */}
            <p className="text-[12px] text-white/55 font-semibold mb-0.5 tracking-wide">
              {current.gym?.city
                ? `${current.gym.city}, TX`
                : current.primary_location || 'Houston, TX'}
            </p>

            {/* Name + age */}
            <h2
              className="font-extrabold text-white leading-none"
              style={{ fontSize: 34, fontFamily: 'Poppins, sans-serif', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
            >
              {(current.display_name ?? 'Member').split(' ')[0]}
              {current.age
                ? <span className="font-medium text-white/80" style={{ fontSize: 28 }}>, {current.age}</span>
                : null}
            </h2>

            {/* Vibe / goal pill */}
            {(current.styles?.[0] || current.goals?.[0] || current.vibe) && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1.5">
                <span className="text-[13px]">🏋️</span>
                <span className="text-[12.5px] font-bold text-white">
                  {current.styles?.[0] || current.goals?.[0] || current.vibe}
                </span>
              </div>
            )}

            {/* Prompt preview */}
            {(() => {
              const saved = sanitizePrompts(current.profile_prompts)
              if (!saved.length) return null
              const meta = findPrompt(saved[0].id)
              if (!meta) return null
              return (
                <div className="mt-2.5 bg-black/50 backdrop-blur-md rounded-2xl px-3.5 py-2.5 border border-white/[0.12]">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--color-primary)] mb-0.5">
                    {meta.question}
                  </p>
                  <p className="text-[13px] text-white/90 font-medium leading-snug line-clamp-2">
                    {saved[0].answer}
                  </p>
                </div>
              )
            })()}

            {/* Match % */}
            {current.score !== null && (
              <div className="mt-2 inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                <span className="text-[11px] font-bold text-white/60">{current.score}% Match</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Action button row ─────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-3 mt-5">
        {/* Pass — X */}
        <button
          onClick={pass}
          className="h-[58px] w-[58px] rounded-full bg-[#1a1a1a] border border-white/15 shadow-lg flex items-center justify-center text-white/70 hover:bg-white/[0.1] active:scale-95 transition-all"
          aria-label="Pass"
        >
          <X className="w-6 h-6" strokeWidth={2.5} />
        </button>

        {/* Rewind */}
        <button
          onClick={rewind}
          disabled={history.length === 0}
          className="h-[50px] w-[50px] rounded-full bg-[#1a1a1a] border border-white/15 shadow-lg flex items-center justify-center text-amber-400 hover:bg-white/[0.1] active:scale-95 transition-all disabled:opacity-25 disabled:cursor-not-allowed"
          aria-label="Rewind"
        >
          <RotateCcw className="w-[18px] h-[18px]" strokeWidth={2.5} />
        </button>

        {/* Connect — big heart CTA */}
        <button
          onClick={like}
          className="h-[68px] w-[68px] rounded-full flex items-center justify-center active:scale-95 transition-all"
          style={{
            background: 'linear-gradient(135deg,#dc1616 0%,#ff4444 100%)',
            boxShadow: '0 0 28px rgba(220,22,22,0.55), 0 4px 16px rgba(0,0,0,0.4)',
          }}
          aria-label="Connect"
        >
          <Heart className="w-7 h-7 text-white fill-white" />
        </button>

        {/* Super like — star */}
        <button
          className="h-[50px] w-[50px] rounded-full bg-[#1a1a1a] border border-white/15 shadow-lg flex items-center justify-center text-cyan-400 hover:bg-white/[0.1] active:scale-95 transition-all"
          aria-label="Super like"
          onClick={() => {/* future: super like */ like()}}
        >
          <Star className="w-[18px] h-[18px] fill-cyan-400" strokeWidth={0} />
        </button>

        {/* Boost / Message */}
        <Link
          href={current ? `/app/profile/${current.id}` : '#'}
          className="h-[58px] w-[58px] rounded-full bg-[#1a1a1a] border border-white/15 shadow-lg flex items-center justify-center text-white/70 hover:bg-white/[0.1] active:scale-95 transition-all"
          aria-label="View profile"
        >
          <Zap className="w-5 h-5" />
        </Link>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────── */}
      <div className="flex gap-1.5 mt-4 px-2">
        {profiles.slice(0, Math.min(profiles.length, 10)).map((_, i) => (
          <div
            key={i}
            className="h-[3px] rounded-full transition-all duration-300"
            style={{
              width: i === index ? 20 : 8,
              background: i === index
                ? 'var(--color-primary)'
                : i < index
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(255,255,255,0.08)',
            }}
          />
        ))}
        {profiles.length > 10 && (
          <span className="text-[10px] text-white/30 font-medium self-center ml-1">+{profiles.length - 10}</span>
        )}
      </div>

      {/* ── It's a match overlay ──────────────────────────────────────── */}
      {matchedName && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <p className="text-[13px] uppercase tracking-widest font-bold text-[var(--color-primary)] mb-2">It's a match!</p>
          <p className="text-[28px] font-extrabold text-white">You & {matchedName}</p>
          <p className="mt-2 text-[14px] text-white/60">Opening your conversation…</p>
        </div>
      )}
    </div>
  )
}
