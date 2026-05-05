// /how-it-works — full walkthrough of the WorkoutPartna user journey.
import Link from 'next/link'
import type { Metadata } from 'next'
import { PublicNav } from '../../components/public/PublicNav'
import { PublicFooter } from '../../components/public/PublicFooter'
import { PageShell, Section, Eyebrow, H2, Lede } from '../../components/public/Section'

export const metadata: Metadata = {
  title: 'How WorkoutPartna Works',
  description: 'Choose your gym, build your profile, match with compatible Partnas, and stay accountable. Here is the full walkthrough.',
}

const steps = [
  {
    title: 'Choose Your Location',
    body: 'Select the place you actually train: commercial gym, apartment fitness center, community center, HOA fitness room, corporate gym, or other public fitness facility. This becomes the center of your experience.',
    detail: 'Locations include EOS, Planet Fitness, LA Fitness, YMCA, apartment complex fitness centers, and any local fitness space. Don\'t see yours? Add it.',
  },
  {
    title: 'Build Your Fitness Profile',
    body: 'Tell us your goals, schedule, fitness level, workout style, and what you\'re looking for in a partner. The more specific you are, the better your matches.',
    detail: 'We ask about goals (build muscle, lose weight, get stronger, etc.), workout days and times, level (beginner to athlete), training style (strength, HIIT, yoga, run), and your accountability vibe.',
  },
  {
    title: 'Match With Compatible Partnas',
    body: 'See people who train where you train, with a clear compatibility score and badges that explain why you match. No mystery, no fake matches.',
    detail: 'Compatibility uses a simple scoring system: same location 40, schedule overlap 25, shared goal 15, fitness level 10, workout style 10. Every match is real and explained.',
  },
  {
    title: 'Message and Plan Workouts',
    body: 'Connect, chat, and schedule workouts together. Use Workout Invites to lock in a time and location. Hit streaks. Join challenges. Stay accountable.',
    detail: 'Quick prompts make starting easy. Workout Invites confirm date, time, location, and workout type. Daily and weekly streaks reward consistency.',
  },
]

export default function HowItWorksPage() {
  return (
    <>
      <PublicNav />
      <PageShell>
        <Section>
          <Eyebrow>How it works</Eyebrow>
          <H2>From signup to your first session.</H2>
          <Lede>
            Four steps. Most people are matched with a Partna at their gym in under 10 minutes.
          </Lede>

          <ol className="mt-12 space-y-6">
            {steps.map((s, i) => (
              <li key={s.title} className="grid gap-4 md:grid-cols-[80px_1fr] rounded-2xl border border-[var(--color-border)] bg-white p-6">
                <div className="flex md:flex-col items-center md:items-start gap-3">
                  <span className="h-14 w-14 rounded-full brand-gradient text-white font-extrabold text-[20px] flex items-center justify-center shadow-glow">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-[18px] text-[var(--color-foreground)]">{s.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-foreground)]/85">{s.body}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-muted-foreground)]">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 p-6 text-center">
            <h3 className="font-extrabold text-[18px] text-[var(--color-foreground)]">
              Ready to find your Partna?
            </h3>
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <Link href="/app/signup" className="h-11 px-6 rounded-full brand-gradient text-white inline-flex items-center font-bold text-[14px] shadow-glow">
                Find My Partna
              </Link>
              <Link href="/for-gyms-apartments" className="h-11 px-6 rounded-full border border-[var(--color-border)] inline-flex items-center font-semibold text-[14px] text-[var(--color-foreground)]">
                Bring WorkoutPartna to my community
              </Link>
            </div>
          </div>
        </Section>
      </PageShell>
      <PublicFooter />
    </>
  )
}
