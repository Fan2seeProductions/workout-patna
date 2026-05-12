// WorkoutPartna — Landing Page. Dark, athletic, conversion-first.
import Link from 'next/link'
import { PublicNav } from '../components/public/PublicNav'
import { PublicFooter } from '../components/public/PublicFooter'

export default function HomePage() {
  return (
    <div className="bg-[#0d0d0d] text-white min-h-screen">
      <PublicNav />

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Woman working out — right side, fades into dark left */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-woman.jpg"
          alt="Woman working out at the gym"
          className="absolute inset-0 w-full h-full object-cover object-[75%_25%]"
          style={{ opacity: 0.65 }}
        />
        {/* Strong left-to-right gradient so text stays readable */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, #0d0d0d 38%, rgba(13,13,13,0.75) 58%, rgba(13,13,13,0.15) 100%)' }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-40" style={{ background: 'linear-gradient(to top, #0d0d0d, transparent)' }} />

        <div className="relative mx-auto max-w-5xl px-5 sm:px-8 py-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[hsl(0,78%,48%)]/15 border border-[hsl(0,78%,48%)]/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[hsl(0,78%,48%)] animate-pulse" />
            <span className="text-[12px] font-bold tracking-widest uppercase text-[hsl(0,78%,58%)]">Now live in Houston, TX</span>
          </div>

          <h1 className="text-[52px] sm:text-[72px] lg:text-[88px] font-black leading-[0.95] tracking-tight">
            Stop training<br />
            <span style={{ background: 'linear-gradient(135deg, #dc1616 0%, #ff4444 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              alone.
            </span>
          </h1>

          <p className="mt-6 text-[18px] sm:text-[22px] text-white/70 max-w-xl leading-relaxed font-medium">
            Find people at <strong className="text-white">your exact gym</strong> who
            show up, stay consistent, and push harder. Together.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/app/signup"
              className="h-14 px-8 rounded-full text-white font-black text-[16px] inline-flex items-center gap-2 shadow-[0_8px_32px_-4px_rgba(220,22,22,0.6)] transition hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #b91010 0%, #dc1616 100%)' }}
            >
              Find My Partna
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link
              href="/for-gyms-apartments"
              className="h-14 px-8 rounded-full border border-white/20 bg-white/[0.06] font-bold text-[16px] inline-flex items-center gap-2 hover:bg-white/[0.1] transition"
            >
              I own a gym
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {['DC','MK','TR','JL','AS'].map((i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-[#0d0d0d] flex items-center justify-center text-[10px] font-black" style={{ background: 'linear-gradient(135deg, #b91010 0%, #dc1616 100%)' }}>
                  {i}
                </div>
              ))}
            </div>
            <p className="text-[13px] text-white/60">
              <span className="text-white font-bold">400+</span> members already training in Houston
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. PAIN POINT ───────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center">
          <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-5">The problem</p>
          <h2 className="text-[32px] sm:text-[48px] font-black leading-tight tracking-tight">
            80% of people quit the gym<br />
            <span className="text-white/60">within the first 5 months.</span>
          </h2>
          <p className="mt-6 text-[17px] text-white/65 max-w-2xl mx-auto leading-relaxed">
            Not because of lack of motivation. Because there's no one holding them accountable.
            A partner changes everything. <span className="text-white font-semibold">People who work out with a partner are 2x more likely to stick with it.</span>
          </p>
        </div>

        {/* Stat row */}
        <div className="mt-14 mx-auto max-w-4xl px-5 sm:px-8 grid grid-cols-3 gap-4 sm:gap-8">
          {[
            { stat: '2×', label: 'More likely to stay consistent with a partner' },
            { stat: '95%', label: 'Of gym-goers want someone to train with' },
            { stat: '0', label: 'Good apps for finding a gym partner near you' },
          ].map(s => (
            <div key={s.stat} className="text-center">
              <p className="text-[40px] sm:text-[52px] font-black" style={{ background: 'linear-gradient(135deg, #dc1616 0%, #ff5555 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.stat}</p>
              <p className="mt-1 text-[12px] sm:text-[13px] text-white/60 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.06] bg-[#111]">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-4">How it works</p>
            <h2 className="text-[32px] sm:text-[44px] font-black tracking-tight">Up and running in 3 minutes.</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                n: '01',
                title: 'Pick your gym',
                body: 'Search for your gym, apartment fitness center, or community space. That\'s your home base.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>
                  </svg>
                ),
              },
              {
                n: '02',
                title: 'Match by schedule & goals',
                body: 'Tell us when you train and what you\'re working on. We show you compatible people at your location.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="8" r="3.2"/><path d="M3 21a6 6 0 0 1 12 0"/>
                    <circle cx="17" cy="9" r="2.6"/><path d="M14 21a5 5 0 0 1 9 0" opacity="0.7"/>
                  </svg>
                ),
              },
              {
                n: '03',
                title: 'Show up together',
                body: 'Message, send a workout invite, and lock in your session. Streaks and check-ins keep you both honest.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 6"/>
                  </svg>
                ),
              },
            ].map((step) => (
              <div key={step.n} className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7 hover:border-[hsl(0,78%,48%)]/40 hover:bg-white/[0.05] transition-all">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[hsl(0,78%,58%)]" style={{ background: 'hsl(0,78%,48%,0.12)' }}>
                    {step.icon}
                  </div>
                  <span aria-hidden="true" className="text-[40px] font-black text-white/[0.06] leading-none">{step.n}</span>
                </div>
                <h3 className="text-[18px] font-black mb-2">{step.title}</h3>
                <p className="text-[14px] text-white/60 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. FEATURES ─────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">

          {/* Feature 1: Location-first */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-24">
            <div>
              <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-4">Location-first</p>
              <h2 className="text-[30px] sm:text-[40px] font-black leading-tight tracking-tight">
                Only people who train<br />where <em className="not-italic text-[hsl(0,78%,58%)]">you</em> train.
              </h2>
              <p className="mt-5 text-[16px] text-white/65 leading-relaxed">
                No driving across town. No ghost matches. Everyone you see is at your gym, your apartment fitness center, or your community space. Same spot, same schedule.
              </p>
            </div>
            <div className="rounded-3xl border border-white/[0.08] bg-[#111] p-6 space-y-3">
              {[
                { label: 'Same location', pts: '+40 pts', active: true },
                { label: 'Schedule overlap', pts: '+25 pts', active: true },
                { label: 'Shared goal', pts: '+15 pts', active: true },
                { label: 'Fitness level match', pts: '+10 pts', active: false },
                { label: 'Workout style', pts: '+10 pts', active: false },
              ].map(f => (
                <div key={f.label} className={`flex items-center justify-between rounded-2xl px-4 py-3 border ${f.active ? 'border-[hsl(0,78%,48%)]/30 bg-[hsl(0,78%,48%)]/8' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${f.active ? 'bg-[hsl(0,78%,58%)]' : 'bg-white/20'}`} />
                    <span className={`text-[14px] font-semibold ${f.active ? 'text-white' : 'text-white/60'}`}>{f.label}</span>
                  </div>
                  <span className={`text-[13px] font-black ${f.active ? 'text-[hsl(0,78%,58%)]' : 'text-white/25'}`}>{f.pts}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl border border-white/10 bg-white/[0.04] mt-1">
                <span className="text-[14px] font-black text-white">Match score</span>
                <span className="text-[18px] font-black" style={{ background: 'linear-gradient(135deg, #dc1616 0%, #ff4444 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>90%</span>
              </div>
            </div>
          </div>

          {/* Feature 2: Real accountability */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1 grid grid-cols-2 gap-3">
              {[
                { emoji: '📅', title: 'Workout invites', body: 'Lock in a session. Both confirm. Both show up.' },
                { emoji: '🔥', title: 'Streaks', body: 'Daily streaks that keep you both honest.' },
                { emoji: '🏆', title: 'Challenges', body: 'Compete with people at your gym.' },
                { emoji: '💬', title: 'Real chat', body: 'No algorithm. Direct messages with your Partna.' },
              ].map(f => (
                <div key={f.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <p className="text-2xl mb-2">{f.emoji}</p>
                  <p className="text-[13px] font-black text-white mb-1">{f.title}</p>
                  <p className="text-[12px] text-white/45 leading-snug">{f.body}</p>
                </div>
              ))}
            </div>
            <div className="order-1 md:order-2">
              <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-4">Real accountability</p>
              <h2 className="text-[30px] sm:text-[40px] font-black leading-tight tracking-tight">
                More than matching.<br />Built to keep you<br /><span className="text-[hsl(0,78%,58%)]">showing up.</span>
              </h2>
              <p className="mt-5 text-[16px] text-white/65 leading-relaxed">
                Workout invites, streaks, local challenges, and a direct line to your Partna. The whole system is built around one thing: making sure both of you show up.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 5. WHO IT'S FOR ─────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.06] bg-[#111]">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-4">Who it's for</p>
            <h2 className="text-[32px] sm:text-[44px] font-black tracking-tight">It works wherever you already train.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { emoji: '🏋️', label: 'Gym members', body: 'Stop training alone at your commercial gym.', href: '/app/signup' },
              { emoji: '🏢', label: 'Apartment residents', body: 'Meet neighbors who use the same fitness center.', href: '/for-gyms-apartments#partner' },
              { emoji: '🏃', label: 'Community centers', body: 'Connect with locals at rec centers and parks.', href: '/for-gyms-apartments#partner' },
              { emoji: '💪', label: 'Trainers', body: 'Get discovered by people who need you.', href: '/trainers' },
            ].map(a => (
              <Link
                key={a.label}
                href={a.href}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 hover:border-[hsl(0,78%,48%)]/40 hover:bg-white/[0.05] transition group block"
              >
                <p className="text-3xl mb-3">{a.emoji}</p>
                <p className="text-[15px] font-black mb-1.5 group-hover:text-[hsl(0,78%,58%)] transition">{a.label}</p>
                <p className="text-[13px] text-white/60 leading-snug">{a.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CTA ────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(220,22,22,0.12) 0%, transparent 70%)' }} />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-8 text-center">
          <h2 className="text-[36px] sm:text-[56px] font-black leading-tight tracking-tight">
            Your gym is full of<br />potential Partnas.
          </h2>
          <p className="mt-5 text-[17px] text-white/65 max-w-xl mx-auto">
            None of them know you exist yet.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link
              href="/app/signup"
              className="h-14 px-10 rounded-full text-white font-black text-[16px] inline-flex items-center gap-2 shadow-[0_8px_40px_-4px_rgba(220,22,22,0.55)] transition hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #b91010 0%, #dc1616 100%)' }}
            >
              Get Started, It's Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <p className="mt-4 text-[12px] text-white/30">No credit card. Free to match. Houston area.</p>

          {/* FAQ strip */}
          <div className="mt-16 grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {[
              { q: 'Is it free?', a: 'Yes. Finding and messaging Partnas is 100% free. Optional AI coaching is $9.99/mo.' },
              { q: 'What cities?', a: 'Houston TX area to start: Cypress, Katy, The Woodlands, Sugar Land, Pearland, Spring.' },
              { q: 'What gyms are on it?', a: 'Any gym, apartment fitness center, or community space. Search by name during onboarding.' },
              { q: 'How is matching done?', a: 'Location (40 pts), schedule overlap (25 pts), goals, fitness level, and workout style.' },
            ].map(f => (
              <div key={f.q} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                <p className="text-[13px] font-black text-white mb-1">{f.q}</p>
                <p className="text-[12px] text-white/45 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
