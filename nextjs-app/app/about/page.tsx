// /about — Who we are, what we built, and how it works.
import Link from 'next/link'
import type { Metadata } from 'next'
import { PublicNav } from '../../components/public/PublicNav'
import { PublicFooter } from '../../components/public/PublicFooter'

export const metadata: Metadata = {
  title: 'About WorkoutPartna',
  description: 'WorkoutPartna is a fitness accountability platform built for real people who train at real locations. Find out who we are, why we built it, and how it works.',
}

const steps = [
  {
    n: '01',
    title: 'Choose Your Location',
    body: 'Select the place you actually train: commercial gym, apartment fitness center, community center, or any public fitness space. This becomes the center of your experience.',
    detail: 'Locations include Planet Fitness, LA Fitness, YMCA, apartment complex fitness centers, and any local fitness space. Don\'t see yours? We\'ll add it.',
  },
  {
    n: '02',
    title: 'Build Your Fitness Profile',
    body: 'Tell us your goals, schedule, fitness level, workout style, and what you\'re looking for in a partner. The more specific you are, the better your matches.',
    detail: 'We ask about goals (build muscle, lose weight, get stronger, stay consistent), workout days and times, level (beginner to athlete), training style (strength, HIIT, yoga, run, boxing), and your accountability vibe.',
  },
  {
    n: '03',
    title: 'Match With Compatible Partnas',
    body: 'See people who train where you train, with a clear compatibility score and badges that explain exactly why you match. No mystery, no fake matches.',
    detail: 'Compatibility uses a simple scoring system: same location (40 pts), schedule overlap (25 pts), shared goal (15 pts), fitness level (10 pts), workout style (10 pts). Every match is real and explained.',
  },
  {
    n: '04',
    title: 'Show Up Together',
    body: 'Connect, chat, and schedule workouts. Use Workout Invites to lock in a time. Build streaks. Join gym challenges. Stay accountable.',
    detail: 'Workout Invites confirm date, time, location, and workout type. Daily and weekly streaks reward consistency. Local challenges let you compete with neighbors.',
  },
]

const values = [
  {
    emoji: '📍',
    title: 'Location first',
    body: 'Every match starts with where you actually train. No driving across town, no strangers from the other side of the city.',
  },
  {
    emoji: '🤝',
    title: 'Real accountability',
    body: 'We\'re not a tracking app. We\'re built around the one thing proven to keep people consistent: having someone else counting on you.',
  },
  {
    emoji: '🏘️',
    title: 'Community over algorithm',
    body: 'Your gym, apartment building, or rec center already has a community in it. We just make it visible.',
  },
  {
    emoji: '🚫',
    title: 'No fluff',
    body: 'No AI meal plans, no rep counters, no gamified streaks for their own sake. Just tools that help two people show up.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-[#0d0d0d] text-white min-h-screen">
      <PublicNav />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 pt-20 pb-16">
        <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-5">About</p>
        <h1 className="text-[40px] sm:text-[60px] font-black leading-[1.0] tracking-tight">
          Built for people who<br />
          <span style={{ background: 'linear-gradient(135deg, #dc1616 0%, #ff4444 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            actually show up.
          </span>
        </h1>
        <p className="mt-6 text-[17px] sm:text-[19px] text-white/60 max-w-2xl leading-relaxed">
          WorkoutPartna is a fitness accountability platform that connects people at the same gym,
          apartment fitness center, or community space so nobody has to train alone.
        </p>
      </section>

      {/* Mission */}
      <section className="border-t border-white/[0.06] py-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-4">Why we built this</p>
              <h2 className="text-[28px] sm:text-[36px] font-black leading-tight tracking-tight">
                The gym is full of people who want the same thing you do.
              </h2>
            </div>
            <div className="space-y-4 text-[15px] text-white/60 leading-relaxed">
              <p>
                80% of people who join a gym quit within the first five months. Not because they don't want to be fit. Because showing up alone is hard.
              </p>
              <p>
                A workout partner changes everything. People who train with a partner are twice as likely to stick with it. The problem is finding one who trains where you train, when you train.
              </p>
              <p>
                That's what WorkoutPartna is. A simple way to find the person three treadmills down who has the exact same schedule and goals as you, and would absolutely show up if you asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-white/[0.06] py-16 bg-[#111]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-4">What we stand for</p>
          <h2 className="text-[28px] sm:text-[36px] font-black tracking-tight mb-10">Our values</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {values.map(v => (
              <div key={v.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                <p className="text-3xl mb-3">{v.emoji}</p>
                <h3 className="text-[16px] font-black mb-2">{v.title}</h3>
                <p className="text-[14px] text-white/50 leading-relaxed">{v.body}</p>
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
            From signup to your first session in 4 steps.
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
                  <p className="mt-2 text-[12.5px] text-white/40 leading-relaxed">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Where we operate */}
      <section className="border-t border-white/[0.06] py-16 bg-[#111]">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[13px] uppercase tracking-[0.2em] font-bold text-[hsl(0,78%,58%)] mb-4">Where we are</p>
              <h2 className="text-[28px] sm:text-[36px] font-black leading-tight tracking-tight">
                Starting in Houston.<br />Growing everywhere.
              </h2>
              <p className="mt-5 text-[15px] text-white/55 leading-relaxed">
                WorkoutPartna launched in Houston, Texas, including Cypress, Katy, Spring,
                The Woodlands, Sugar Land, and Pearland. We've expanded to cover the full US,
                Central America, and the Caribbean.
              </p>
              <p className="mt-3 text-[15px] text-white/55 leading-relaxed">
                If your gym, apartment, or community center isn't listed, email us and we'll add it within 24 hours.
              </p>
              <a href="mailto:hello@workoutpartna.com" className="mt-5 inline-flex items-center gap-2 text-[14px] font-bold text-[hsl(0,78%,58%)] hover:underline">
                hello@workoutpartna.com →
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total locations', value: '792+' },
                { label: 'US states covered', value: '50' },
                { label: 'Countries', value: '10+' },
                { label: 'Free to join', value: '$0' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-center">
                  <p className="text-[32px] font-black" style={{ background: 'linear-gradient(135deg, #dc1616 0%, #ff5555 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</p>
                  <p className="mt-1 text-[11px] text-white/45 font-semibold uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06] py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 text-center">
          <h2 className="text-[32px] sm:text-[44px] font-black leading-tight tracking-tight">
            Ready to find your Partna?
          </h2>
          <p className="mt-4 text-[16px] text-white/50">Free to join. No credit card needed.</p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/app/signup"
              className="h-13 px-8 py-3.5 rounded-full text-white font-black text-[15px] inline-flex items-center gap-2 shadow-[0_8px_32px_-4px_rgba(220,22,22,0.5)] transition hover:scale-[1.03]"
              style={{ background: 'linear-gradient(135deg, #b91010 0%, #dc1616 100%)' }}
            >
              Get Started Free →
            </Link>
            <Link
              href="/for-gyms-apartments"
              className="h-13 px-8 py-3.5 rounded-full border border-white/20 bg-white/[0.06] font-bold text-[15px] inline-flex items-center hover:bg-white/[0.1] transition"
            >
              Bring it to my gym
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
