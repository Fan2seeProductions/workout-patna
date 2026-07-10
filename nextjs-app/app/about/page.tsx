// /about — Coach-first mission and what the product is.
import Link from 'next/link'
import type { Metadata } from 'next'
import { PublicNav } from '../../components/public/PublicNav'
import { PublicFooter } from '../../components/public/PublicFooter'

export const metadata: Metadata = {
  title: 'About WorkoutPartna',
  description: 'The AI trainer that texts you the exact workout to do today. Built for general fitness and healthy habit formation — not medical guidance.',
  alternates: { canonical: '/about' },
}

const steps = [
  {
    n: '01',
    title: 'Tell us your goals',
    body: 'A 60-second intake: fitness level, available time, gear you have, what you\'re training for, anything we should avoid. No essays, no quizzes.',
    detail: 'Goals (lose weight, build muscle, get stronger, general fitness), time budget, equipment (full gym, dumbbells only, bodyweight), training style (Peloton, work from home, desk reset, mixed), and any injuries or constraints.',
  },
  {
    n: '02',
    title: 'Get today\'s workout',
    body: 'We text you the plan in the morning, at your chosen time. One clear session — warm-up, main work, finisher, notes. Built for the day you\'re actually having.',
    detail: 'Every plan is built fresh from your profile, history, and the answer to one question: "How do you feel today?" Better sleep, lighter session yesterday, sore right shoulder? It all factors in.',
  },
  {
    n: '03',
    title: 'Reply DONE or MODIFY',
    body: 'Finished? Reply DONE. Too hard or wrong day? Reply MODIFY and it rewrites the plan. Skipped? Reply SKIP, no shame. Tomorrow learns from today.',
    detail: 'Coaching priorities: safety first, then adherence, then personalization, then clarity, then progression. We default to the smallest effective workout when recovery is poor and never punish missed days.',
  },
  {
    n: '04',
    title: 'Stay consistent',
    body: 'Weekly summary, streaks, pause whenever life gets in the way. Reply STOP to opt out anytime. We are not trying to trap you — we are trying to help you train.',
    detail: 'Most people quit fitness apps because the plan stops fitting their week. WorkoutPartna is built to bend around your week instead.',
  },
]

const values = [
  {
    emoji: '🎯',
    title: 'One workout per day',
    body: 'No content libraries to scroll. No 8-week programs that assume a perfect week. Just the workout for today.',
  },
  {
    emoji: '📱',
    title: 'SMS-first',
    body: 'Your trainer texts you. No app required, no notifications to enable, no daily logins. Reply right from your messages.',
  },
  {
    emoji: '🧠',
    title: 'Adapts to you',
    body: 'Sleep, soreness, schedule, equipment, injuries, sport season. Every plan accounts for the human, not just the goal.',
  },
  {
    emoji: '⚖️',
    title: 'Honest about what we are',
    body: 'A coach for general fitness and healthy habits. Not a clinician, not a PT, not an emergency service. We say so out loud.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-[#0d0d0d] text-white min-h-screen">
      <PublicNav />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 pt-20 pb-16">
        <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-5">How it works</p>
        <h1 className="text-[40px] sm:text-[60px] font-black leading-[1.0] tracking-tight">
          The trainer that<br />
          <span style={{ background: 'linear-gradient(135deg, #dc1616 0%, #ff4444 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            texts you first.
          </span>
        </h1>
        <p className="mt-6 text-[17px] sm:text-[19px] text-white/60 max-w-2xl leading-relaxed">
          WorkoutPartna is an AI trainer that delivers one personalized workout per day, adapts to how you feel,
          and keeps you accountable through SMS and an app. Built for general fitness and healthy habit
          formation — not medical guidance.
        </p>
      </section>

      {/* Mission */}
      <section className="border-t border-white/[0.06] py-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-4">Why we built this</p>
              <h2 className="text-[28px] sm:text-[36px] font-black leading-tight tracking-tight">
                Programs assume a perfect week.<br />Real life doesn&apos;t.
              </h2>
            </div>
            <div className="space-y-4 text-[15px] text-white/60 leading-relaxed">
              <p>
                Most fitness apps hand you a 40-page plan and expect you to figure out which part of it to do today. Most personal trainers cost $200 a month and book around their schedule, not yours.
              </p>
              <p>
                The honest user question is much smaller: <span className="text-white font-semibold">what do I do right now?</span> Given the time I have, the gear I have, how I feel, and what I did yesterday.
              </p>
              <p>
                WorkoutPartna answers that question. Every day. In one short text and one clean plan in the app. Then it learns from how you responded and writes a better one tomorrow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-white/[0.06] py-16 bg-[#111]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-4">What we stand for</p>
          <h2 className="text-[28px] sm:text-[36px] font-black tracking-tight mb-10">Our principles</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {values.map(v => (
              <div key={v.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                <p className="text-3xl mb-3">{v.emoji}</p>
                <h3 className="text-[16px] font-black mb-2">{v.title}</h3>
                <p className="text-[14px] text-white/60 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/[0.06] py-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-4">How it works</p>
          <h2 className="text-[28px] sm:text-[36px] font-black tracking-tight mb-10">
            Setup once, train every day.
          </h2>
          <ol className="space-y-4">
            {steps.map(s => (
              <li key={s.n} className="flex gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 hover:border-[hsl(0,78%,48%)]/40 transition">
                <span className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[15px] text-[hsl(0,78%,58%)]" style={{ background: 'hsl(0,78%,48%,0.12)' }}>
                  {s.n}
                </span>
                <div>
                  <h3 className="font-black text-[17px] mb-1.5">{s.title}</h3>
                  <p className="text-[14px] text-white/70 leading-relaxed">{s.body}</p>
                  <p className="mt-2 text-[12.5px] text-white/60 leading-relaxed">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Honest disclaimer */}
      <section className="border-t border-white/[0.06] py-16 bg-[#111]">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-4">What we&apos;re not</p>
          <h2 className="text-[28px] sm:text-[36px] font-black leading-tight tracking-tight mb-5">
            Not a doctor. Not a PT. Not an emergency service.
          </h2>
          <p className="text-[15px] text-white/65 leading-relaxed">
            WorkoutPartna is general fitness coaching. If you report chest pain, fainting, severe injury, pregnancy
            complications, or anything that warrants medical attention, the AI will stop your workout and tell you to
            seek a clinician. That is the design, not a bug. For rehab, sport-specific peaking, or anything that
            needs hands-on assessment, work with a qualified human.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06] py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 text-center">
          <h2 className="text-[32px] sm:text-[44px] font-black leading-tight tracking-tight">
            Try it free for 14 days.
          </h2>
          <p className="mt-4 text-[16px] text-white/60">No credit card. Then $9.99/mo if you keep it.</p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/app/signup"
              className="h-13 px-8 py-3.5 rounded-full text-white font-black text-[15px] inline-flex items-center gap-2 shadow-[0_8px_32px_-4px_rgba(220,22,22,0.5)] transition hover:scale-[1.03]"
              style={{ background: 'linear-gradient(135deg, #b91010 0%, #dc1616 100%)' }}
            >
              Start my 14 days →
            </Link>
            <Link
              href="/pricing"
              className="h-13 px-8 py-3.5 rounded-full border border-white/20 bg-white/[0.06] font-bold text-[15px] inline-flex items-center hover:bg-white/[0.1] transition"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
