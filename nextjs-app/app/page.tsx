// WorkoutPartna — Public marketing landing page.
// Repositioned around the AI Coach product: "The AI trainer that tells you
// the exact workout to do today." Positioning pillars (Clarity, Accountability,
// Adaptation, Real-life fit) and target segments are lifted from the
// WorkoutPartna PRD. Visual language (dark, red accents, large type) preserved.
import Link from 'next/link'
import { PublicNav } from '../components/public/PublicNav'
import { PublicFooter } from '../components/public/PublicFooter'

export default function HomePage() {
  return (
    <div className="bg-[#0d0d0d] text-white min-h-screen">
      <PublicNav />

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-woman.jpg"
          alt="Woman working out at the gym"
          className="absolute inset-0 w-full h-full object-cover object-[75%_25%]"
          style={{ opacity: 0.65 }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, #0d0d0d 38%, rgba(13,13,13,0.75) 58%, rgba(13,13,13,0.15) 100%)' }} />
        <div className="absolute bottom-0 inset-x-0 h-40" style={{ background: 'linear-gradient(to top, #0d0d0d, transparent)' }} />

        <div className="relative mx-auto max-w-5xl px-5 sm:px-8 py-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[hsl(0,78%,48%)]/15 border border-[hsl(0,78%,48%)]/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[hsl(0,78%,48%)] animate-pulse" />
            <span className="text-[12px] font-bold tracking-widest uppercase text-[hsl(0,78%,58%)]">14 days free · No card</span>
          </div>

          <h1 className="text-[52px] sm:text-[72px] lg:text-[88px] font-black leading-[0.95] tracking-tight">
            Your AI trainer.<br />
            <span style={{ background: 'linear-gradient(135deg, #dc1616 0%, #ff4444 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Texted daily.
            </span>
          </h1>

          <p className="mt-6 text-[18px] sm:text-[22px] text-white/70 max-w-xl leading-relaxed font-medium">
            One workout. <strong className="text-white">For today.</strong> Built around your time, gear, and energy. No planning, no guesswork, no generic program.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/app/signup"
              className="h-14 px-8 rounded-full text-white font-black text-[16px] inline-flex items-center gap-2 shadow-[0_8px_32px_-4px_rgba(220,22,22,0.6)] transition hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #b91010 0%, #dc1616 100%)' }}
            >
              Try free for 14 days
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link
              href="/app/signin"
              className="h-14 px-8 rounded-full border border-white/20 bg-white/[0.06] font-bold text-[16px] inline-flex items-center gap-2 hover:bg-white/[0.1] transition"
            >
              I already have an account
            </Link>
          </div>

          <p className="mt-6 text-[13px] text-white/50">
            No credit card. Cancel anytime. Then $9.99/mo if you keep it.
          </p>
        </div>
      </section>

      {/* ── 2. PAIN POINT ───────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center">
          <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-5">The problem</p>
          <h2 className="text-[32px] sm:text-[48px] font-black leading-tight tracking-tight">
            You don't need another plan.<br />
            <span className="text-white/60">You need someone to tell you what to do today.</span>
          </h2>
          <p className="mt-6 text-[17px] text-white/65 max-w-2xl mx-auto leading-relaxed">
            Programs assume a perfect week. Real life doesn't.
            You slept badly. You only have 25 minutes. You're traveling. You're sore.
            <span className="text-white font-semibold"> WorkoutPartna writes one good workout for the day you're actually having.</span>
          </p>
        </div>

        {/* Pillar row — Clarity / Accountability / Adaptation */}
        <div className="mt-14 mx-auto max-w-4xl px-5 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
          {[
            { stat: '1', label: 'Workout per day. One. Not 6 to pick from.' },
            { stat: '60s', label: 'To set up. Your trainer texts you tomorrow.' },
            { stat: '∞', label: 'Variations. Home, gym, hotel, tired, busy — it adapts.' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-[52px] sm:text-[64px] font-black" style={{ background: 'linear-gradient(135deg, #dc1616 0%, #ff5555 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.stat}</p>
              <p className="mt-1 text-[13px] text-white/60 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.06] bg-[#111]">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-4">How it works</p>
            <h2 className="text-[32px] sm:text-[44px] font-black tracking-tight">From setup to first workout in 3 minutes.</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                n: '01',
                title: 'Tell us your goals',
                body: '60-second intake: fitness level, available time, gear, what you\'re training for. No essays.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3 8-8M3 7h7M3 12h5M3 17h9"/>
                  </svg>
                ),
              },
              {
                n: '02',
                title: 'We text you today\'s plan',
                body: 'Every morning at your time. One workout, built for the day you\'re actually having.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                ),
              },
              {
                n: '03',
                title: 'Reply DONE or MODIFY',
                body: 'It learns. Too hard? Backed off. Too easy? Progressed. Bad day? Reset, no shame.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9z"/><path d="M9 12l2 2 4-4"/>
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

      {/* ── 4. SAMPLE TEXT MOCK ─────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-4">What it looks like</p>
              <h2 className="text-[30px] sm:text-[40px] font-black leading-tight tracking-tight">
                A real plan. In a real text.<br />
                <span className="text-[hsl(0,78%,58%)]">Not a 40-page PDF.</span>
              </h2>
              <p className="mt-5 text-[16px] text-white/65 leading-relaxed">
                Every morning your phone buzzes with the workout for today. Time, sets, reps, rest — all in one message. Reply MODIFY to rewrite it. Reply DONE when you're finished. Reply SKIP if life happened. Tomorrow adapts.
              </p>
              <ul className="mt-6 space-y-2 text-[14px] text-white/70">
                <li className="flex items-center gap-2"><span className="text-[hsl(0,78%,58%)]">▸</span>No app required. Reply right from your messages.</li>
                <li className="flex items-center gap-2"><span className="text-[hsl(0,78%,58%)]">▸</span>Full plan also lives in the app for the visual people.</li>
                <li className="flex items-center gap-2"><span className="text-[hsl(0,78%,58%)]">▸</span>Reply STOP anytime. It listens.</li>
              </ul>
            </div>

            {/* Faux iMessage thread */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#111] p-6 space-y-3 font-mono text-[13px]">
              <div className="text-center text-[11px] text-white/30 mb-2">Today · 6:45 AM</div>
              <div className="ml-auto max-w-[80%] bg-[#1a1a1a] border border-white/[0.06] rounded-2xl rounded-br-md px-4 py-2.5 text-white/85">
                How do you feel today? Reply 1 fresh 2 okay 3 tired.
              </div>
              <div className="max-w-[40%] bg-[hsl(0,78%,48%)] rounded-2xl rounded-bl-md px-4 py-2.5 text-white font-bold">
                2
              </div>
              <div className="ml-auto max-w-[88%] bg-[#1a1a1a] border border-white/[0.06] rounded-2xl rounded-br-md px-4 py-2.5 text-white/85 leading-relaxed">
                Today: 25 min upper push. 3 rounds: 8 push-ups, 10 DB press, 12 rows/side, 30s plank. Rest 60s. Reply DONE or MODIFY.
              </div>
              <div className="max-w-[40%] bg-[hsl(0,78%,48%)] rounded-2xl rounded-bl-md px-4 py-2.5 text-white font-bold">
                DONE
              </div>
              <div className="ml-auto max-w-[88%] bg-[#1a1a1a] border border-white/[0.06] rounded-2xl rounded-br-md px-4 py-2.5 text-white/85">
                Nice. Day 4 streak. Tomorrow we'll hit legs.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. WHO IT'S FOR ─────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.06] bg-[#111]">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-4">Who it's for</p>
            <h2 className="text-[32px] sm:text-[44px] font-black tracking-tight">Built for the day you're actually having.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { emoji: '🔁', label: 'Restarting fitness', body: 'No planning required. Just one easy session today.' },
              { emoji: '🏋️', label: 'Gym members', body: 'Get your plan before you walk in.' },
              { emoji: '👶', label: 'Parents and shift workers', body: 'Trains around real life. No fixed schedule needed.' },
              { emoji: '✈️', label: 'Travelers and remote', body: 'Hotel room to full gym — it adapts.' },
            ].map(a => (
              <div
                key={a.label}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 hover:border-[hsl(0,78%,48%)]/40 hover:bg-white/[0.05] transition group"
              >
                <p className="text-3xl mb-3">{a.emoji}</p>
                <p className="text-[15px] font-black mb-1.5 group-hover:text-[hsl(0,78%,58%)] transition">{a.label}</p>
                <p className="text-[13px] text-white/60 leading-snug">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CTA ────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(220,22,22,0.12) 0%, transparent 70%)' }} />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-8 text-center">
          <h2 className="text-[36px] sm:text-[56px] font-black leading-tight tracking-tight">
            Stop wondering<br />what workout to do.
          </h2>
          <p className="mt-5 text-[17px] text-white/65 max-w-xl mx-auto">
            WorkoutPartna texts you the exact plan. Every day. For free for 14 days.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link
              href="/app/signup"
              className="h-14 px-10 rounded-full text-white font-black text-[16px] inline-flex items-center gap-2 shadow-[0_8px_40px_-4px_rgba(220,22,22,0.55)] transition hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #b91010 0%, #dc1616 100%)' }}
            >
              Start my 14 days
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <p className="mt-4 text-[12px] text-white/30">No credit card required. Then $9.99/mo if you keep it.</p>

          {/* FAQ strip */}
          <div className="mt-16 grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {[
              { q: 'Is it really free for 14 days?', a: 'Yes. No credit card. You only pay if you decide to keep it past day 14. Then $9.99/mo, cancel anytime.' },
              { q: 'Do I have to use SMS?', a: 'No. You can use the app, SMS, or both. The plan lives in your app every day either way.' },
              { q: 'What if I have an injury or a bad day?', a: 'Tell it. Reply MODIFY and it rewrites the plan around what you can do. No shame, no fixed schedule.' },
              { q: 'Is it a real personal trainer?', a: 'It is a highly tuned AI trainer for general fitness and habit formation. For medical or rehab guidance, see a clinician.' },
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
