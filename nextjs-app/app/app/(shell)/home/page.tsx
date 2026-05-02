// Home dashboard. Mirrors the Replit Workout Partna Home page:
// daily motivation, hero, social proof strip, this-week events, suggested
// partnas, merch promo, testimonials, floating action button.
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  MapPin, ArrowRight, Users as UsersIcon, Search, Zap,
  Star, Clock, CheckCircle2, Flame, ShoppingBag,
} from 'lucide-react'
import { createClient } from '../../../../lib/supabase/server'
import { matchScore } from '../../../../lib/matching'
import { splashHero } from '../../../../lib/photos'

export const metadata: Metadata = {
  title: 'Home',
  robots: { index: false, follow: false },
}

const events = [
  { id: 1, title: 'Early Bird Lifting Club',  type: 'Workout', time: 'Mon 6am', attendees: 12, color: 'bg-[var(--color-secondary)]' },
  { id: 2, title: 'Cardio & Coffee Meetup',   type: 'Social',  time: 'Wed 7am', attendees: 8,  color: 'bg-[var(--color-primary)]' },
  { id: 3, title: 'Weekend Warriors',         type: 'Group',   time: 'Sat 9am', attendees: 15, color: 'bg-[var(--color-accent)]' },
]

const testimonials = [
  { id: 1, text: "Found my perfect gym partner in 2 days. We've been training together for 6 months now!", author: 'Marcus J.' },
  { id: 2, text: 'Finally have someone to spot me. No more awkward gym asks!', author: 'Sarah T.' },
]

type ProfileLite = {
  id: string
  display_name: string | null
  age: number | null
  fitness_level: string | null
  goals: string[] | null
  styles: string[] | null
  primary_location: string | null
  schedule_days: string[] | null
  schedule_times: string[] | null
  vibe: string | null
  photo_url: string | null
}

function greeting(now: Date) {
  const h = now.getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function firstName(s: string | null | undefined) {
  if (!s) return 'Friend'
  return s.split(' ')[0]
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Pull viewer's profile, suggested partnas (top 3), today's motivation
  const [meRes, othersRes, motivRes] = await Promise.all([
    user
      ? supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      : Promise.resolve({ data: null as ProfileLite | null }),
    supabase.from('profiles').select('id, display_name, age, fitness_level, goals, styles, primary_location, schedule_days, schedule_times, vibe, photo_url').neq('id', user?.id ?? '00000000-0000-0000-0000-000000000000').limit(20),
    supabase.from('daily_motivations').select('id, text, author').limit(8),
  ])

  const me = (meRes.data ?? null) as ProfileLite | null
  const others = (othersRes.data ?? []) as ProfileLite[]
  const motivations = (motivRes.data ?? []) as { id: string; text: string; author: string }[]

  // Pick a deterministic motivation for today
  const dayIdx = motivations.length > 0
    ? Math.floor(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()) / 86_400_000) % motivations.length
    : 0
  const motivation = motivations[dayIdx]

  const suggested = others
    .map(p => ({ ...p, score: me ? matchScore(me, p) : 80 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const inviteCount = 0 // user invites not implemented yet
  const isPremium = false
  const showWatermark = false // disabled — was triggering on every page
  const userName = me?.display_name ?? user?.email?.split('@')[0] ?? 'Friend'
  const userInitial = (firstName(userName)[0] ?? '?').toUpperCase()

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pt-8 md:pt-10 space-y-10 pb-24 relative">

      {/* Watermark overlay */}
      {showWatermark && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="text-center opacity-[0.06] -rotate-45" style={{ fontSize: 120, fontWeight: 'bold', whiteSpace: 'nowrap', lineHeight: 1 }}>
            Powered by<br />WorkoutPartna.com
          </div>
        </div>
      )}

      {/* Invite progress */}
      {showWatermark && (
        <section className="bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 border border-[var(--color-primary)]/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[var(--color-primary)]/5 rounded-full blur-2xl" />
          <div className="relative">
            <h3 className="font-bold text-lg mb-2 text-[var(--color-foreground)]">Remove Watermark 🎯</h3>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
              Invite {3 - inviteCount} more friend{3 - inviteCount !== 1 ? 's' : ''} to remove the watermark!
              Invite 5 friends to unlock <span className="font-bold text-[var(--color-secondary)]">1 week free premium</span>!
            </p>
            <div className="space-y-3">
              <ProgressRow label="Remove Watermark" current={inviteCount} target={3} color="bg-[var(--color-primary)]" />
              <ProgressRow label="Get Free Premium Week" current={inviteCount} target={5} color="bg-[var(--color-secondary)]" />
            </div>
            <button className="w-full mt-4 py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-xl font-bold text-sm hover:opacity-90 transition">
              Copy Invite Link
            </button>
          </div>
        </section>
      )}

      {/* Welcome */}
      <header className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)] font-display">
            {greeting(new Date())}, {firstName(userName)}!
          </h1>
          <p className="text-[var(--color-muted-foreground)] mt-1 text-sm md:text-base flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-[var(--color-secondary)]" />
            {me?.primary_location || 'Set your location'}
          </p>
        </div>
        <Link href="/app/profile" className="relative h-12 w-12 group">
          <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-[var(--color-secondary)]/50 hover:border-[var(--color-secondary)] transition-colors shadow-sm relative z-10">
            {me?.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={me.photo_url} alt="You" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[var(--color-muted)] flex items-center justify-center">
                <span className="text-lg font-bold text-[var(--color-muted-foreground)]">{userInitial}</span>
              </div>
            )}
          </div>
          {isPremium && (
            <div className="absolute -bottom-1 -right-1 bg-[var(--color-secondary)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[var(--color-background)] z-20">
              PRO
            </div>
          )}
        </Link>
      </header>

      {/* Daily motivation */}
      {motivation && (
        <section className="bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 rounded-2xl p-5 border border-[var(--color-primary)]/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-secondary)]/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="flex items-start gap-4 relative">
            <div className="h-12 w-12 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center text-[var(--color-secondary)] shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-[var(--color-secondary)] uppercase tracking-wider mb-2">Daily Motivation</p>
              <p className="text-lg font-medium text-[var(--color-foreground)] leading-relaxed italic">
                &ldquo;{motivation.text}&rdquo;
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Upgrade banner */}
      {!isPremium && (
        <section className="bg-gradient-to-r from-[var(--color-secondary)]/10 to-[var(--color-secondary)]/5 border border-[var(--color-secondary)]/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[var(--color-secondary)]/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-4 relative">
            <div className="h-12 w-12 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center text-[var(--color-secondary)] shrink-0">
              <Zap className="w-6 h-6 fill-[var(--color-secondary)]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[var(--color-foreground)]">Upgrade to Unlimited</h3>
              <p className="text-sm text-[var(--color-muted-foreground)]">Get unlimited matches, messages, and priority visibility.</p>
            </div>
          </div>
          <Link
            href="/app/coach"
            className="w-full md:w-auto px-6 py-2.5 bg-[var(--color-secondary)] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap text-center"
          >
            Upgrade for $10/mo
          </Link>
        </section>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-xl group">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/90 via-[var(--color-primary)]/80 to-[var(--color-primary)]/40 z-10 mix-blend-multiply" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={splashHero} alt="Gym Community" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
        <div className="relative z-20 p-6 md:p-10 flex flex-col items-start gap-5">
          <div className="flex gap-2">
            <span className="bg-[var(--color-secondary)] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm animate-pulse">New</span>
            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">Community First</span>
          </div>
          <div className="space-y-2 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight">
              Most people stop going to the gym because they go alone.
            </h2>
            <p className="text-xl md:text-2xl font-light text-white/90 italic">
              Find someone who shows up for you.
            </p>
          </div>
          <Link
            href="/app/browse"
            className="mt-4 bg-white text-[var(--color-primary)] px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Meet Your Gym Person
          </Link>
        </div>
      </section>

      {/* Social proof */}
      <section className="-mt-2">
        <p className="text-xs font-bold text-[var(--color-muted-foreground)] uppercase tracking-widest text-center mb-4">Trusted by members at</p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-60 hover:opacity-100 transition-opacity">
          {["GOLD'S GYM", '24 HOUR FITNESS', 'LA FITNESS', 'EQUINOX', 'EOS FITNESS'].map(b => (
            <span key={b} className="font-display font-black text-xl text-[var(--color-foreground)]/70">{b}</span>
          ))}
        </div>
      </section>

      {/* Happening this week */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold font-display text-[var(--color-foreground)] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[var(--color-secondary)] fill-[var(--color-secondary)]" />
            Happening This Week
          </h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {events.map(event => (
            <div key={event.id} className="min-w-[260px] bg-[var(--color-card)] rounded-2xl p-5 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${event.color}`} />
              <div className="space-y-3">
                <span className="text-xs font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider border border-[var(--color-border)] px-2 py-0.5 rounded-md bg-[var(--color-muted)]/30">{event.type}</span>
                <h4 className="font-bold text-lg leading-tight text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">{event.title}</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--color-foreground)]">{event.time}</span>
                  <span className="text-[var(--color-muted-foreground)] flex items-center text-xs bg-[var(--color-muted)] px-2 py-1 rounded-full">
                    <UsersIcon className="w-3 h-3 mr-1" /> {event.attendees} going
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Suggested Partnas */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold font-display text-[var(--color-foreground)]">Suggested Partnas</h3>
          <Link href="/app/browse" className="text-[var(--color-primary)] text-sm font-bold hover:underline flex items-center">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {suggested.length === 0 ? (
          <div className="bg-[var(--color-card)] rounded-3xl p-8 border border-[var(--color-border)] text-center">
            <div className="w-16 h-16 bg-[var(--color-muted)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[var(--color-muted-foreground)]" />
            </div>
            <h4 className="font-bold text-lg mb-2 text-[var(--color-foreground)]">No Partnas Yet</h4>
            <p className="text-[var(--color-muted-foreground)] text-sm mb-4">Complete your profile to see workout partners near you.</p>
            <Link href="/app/onboarding" className="inline-block px-6 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-xl font-bold text-sm">
              Complete Profile
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {suggested.map(p => (
              <div key={p.id} className="bg-[var(--color-card)] rounded-3xl p-5 border border-[var(--color-border)] shadow-sm hover:shadow-lg hover:border-[var(--color-secondary)]/20 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider">Compatibility</span>
                    <span className="text-xl font-black text-[var(--color-accent)] flex items-center gap-1">
                      {p.score}% <CheckCircle2 className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-[10px] font-bold border border-green-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Active
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="relative h-20 w-20 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-md group-hover:scale-105 transition-transform">
                    {p.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.photo_url} alt={p.display_name ?? ''} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 flex items-center justify-center">
                        <span className="text-2xl font-bold text-[var(--color-primary)]">{(p.display_name ?? '?')[0]?.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-lg text-[var(--color-foreground)] truncate">
                      {firstName(p.display_name)}{p.age ? `, ${p.age}` : ''}
                    </h4>
                    <p className="text-xs text-[var(--color-muted-foreground)] flex items-center mt-1 truncate">
                      <MapPin className="w-3 h-3 mr-1" /> {p.primary_location || 'Your area'}
                    </p>
                    {p.fitness_level && (
                      <div className="flex gap-1 mt-2">
                        <span className="text-[10px] font-bold bg-[var(--color-muted)] text-[var(--color-muted-foreground)] px-2 py-0.5 rounded-md">
                          {p.fitness_level}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-dashed border-[var(--color-border)]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[var(--color-muted-foreground)] font-medium">Goal</span>
                    <span className="font-bold text-[var(--color-foreground)]">{p.goals?.[0] || 'Get fit'}</span>
                  </div>
                  <div className="w-full bg-[var(--color-muted)] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[var(--color-secondary)] h-full rounded-full" style={{ width: `${p.score}%` }} />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-muted-foreground)]">
                    <Clock className="w-3.5 h-3.5" />
                    {p.vibe || 'Friendly Chat'}
                  </div>
                </div>

                <Link
                  href={`/app/profile/${p.id}`}
                  className="block w-full mt-4 py-2.5 rounded-xl border border-[var(--color-border)] font-bold text-sm text-center hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all shadow-sm"
                >
                  Connect
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Merch promo */}
      <section className="bg-gradient-to-r from-[var(--color-foreground)] to-[var(--color-foreground)]/90 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-secondary)]/20 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-[var(--color-secondary)]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl">Workout Partna Gear</h3>
              <p className="text-white/70 text-sm">Rep the mindset. Wear the commitment.</p>
            </div>
          </div>
          <Link
            href="/app/merch"
            className="px-6 py-3 bg-[var(--color-secondary)] text-white rounded-xl font-bold hover:opacity-90 transition flex items-center gap-2"
          >
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[var(--color-primary)]/5 -mx-4 px-4 py-8 md:rounded-3xl md:mx-0">
        <h3 className="text-center text-lg font-bold font-display mb-6 flex items-center justify-center gap-2 text-[var(--color-foreground)]">
          <Star className="w-5 h-5 text-[var(--color-secondary)] fill-[var(--color-secondary)]" />
          Real Success Stories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map(t => (
            <div key={t.id} className="bg-[var(--color-card)] p-6 rounded-2xl shadow-sm border border-white relative">
              <div className="absolute -top-3 -left-2 text-6xl font-serif text-[var(--color-primary)]/10 leading-none">&ldquo;</div>
              <p className="text-[var(--color-foreground)]/80 font-medium italic relative mb-4">{t.text}</p>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]" />
                <span className="text-xs font-bold text-[var(--color-muted-foreground)]">{t.author}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAB */}
      <Link
        href="/app/browse"
        className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 bg-[var(--color-secondary)] text-white px-6 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all flex items-center gap-2 border-2 border-white/20"
      >
        <Zap className="w-5 h-5 fill-white" />
        Find Partnas
      </Link>
    </div>
  )
}

function ProgressRow({ label, current, target, color }: { label: string; current: number; target: number; color: string }) {
  const pct = Math.min(current / target, 1) * 100
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-bold text-[var(--color-muted-foreground)]">{label}</span>
        <span className="text-xs font-bold text-[var(--color-primary)]">{current}/{target}</span>
      </div>
      <div className="w-full bg-[var(--color-muted)] h-2 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
