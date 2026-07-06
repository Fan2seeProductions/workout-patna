// /exercises — free public exercise library. 868 illustrated how-to guides,
// grouped by muscle. This is deliberately public + indexable: it's the site's
// linkable asset (bloggers/forums link to exercise how-tos) and long-tail SEO
// surface, with a CTA into the AI coach funnel on every page.
import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicNav } from '../../components/public/PublicNav'
import { PublicFooter } from '../../components/public/PublicFooter'
import { allExercises, exerciseSlug } from '../../lib/exercises/match'

export const metadata: Metadata = {
  title: 'Free Exercise Library — 800+ Exercises with Photos & Instructions',
  description:
    'Browse 868 exercises with photos and step-by-step instructions — bodyweight, dumbbell, barbell, bands and more, organized by muscle group. Free, no signup.',
  alternates: { canonical: 'https://workoutpartna.com/exercises' },
}

const MUSCLE_ORDER = [
  'chest', 'shoulders', 'lats', 'middle back', 'lower back', 'traps',
  'biceps', 'triceps', 'forearms', 'abdominals', 'quadriceps', 'hamstrings',
  'glutes', 'calves', 'adductors', 'abductors', 'neck',
]

function titleCase(s: string) {
  return s.replace(/\b\w/g, c => c.toUpperCase())
}

export default function ExerciseLibraryPage() {
  const groups = new Map<string, ReturnType<typeof allExercises>>()
  for (const ex of allExercises()) {
    const m = ex.primaryMuscles[0] ?? 'other'
    if (!groups.has(m)) groups.set(m, [])
    groups.get(m)!.push(ex)
  }
  const ordered = MUSCLE_ORDER.filter(m => groups.has(m))

  return (
    <>
      <PublicNav />
      <main className="bg-[#0d0d0d] text-white min-h-screen">
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-10">
          <p className="text-[11px] uppercase font-bold tracking-[0.18em] text-[var(--color-primary)]">
            Free exercise library
          </p>
          <h1 className="mt-3 text-[34px] sm:text-[44px] font-extrabold leading-[1.05] tracking-tight max-w-3xl">
            868 exercises. Photos and step-by-step form guides. Free.
          </h1>
          <p className="mt-4 text-[16px] text-white/65 leading-relaxed max-w-2xl">
            Every exercise below has start/finish photos and numbered instructions —
            bodyweight, dumbbells, barbell, bands, machines and more. No signup, no paywall.
            Want them assembled into a plan that fits <em>your</em> life? That&rsquo;s what the{' '}
            <Link href="/" className="text-[var(--color-primary)] font-bold hover:underline">AI coach</Link> does daily.
          </p>

          {/* Muscle-group jump nav */}
          <div className="mt-8 flex flex-wrap gap-2">
            {ordered.map(m => (
              <a
                key={m}
                href={`#${m.replace(/\s+/g, '-')}`}
                className="h-9 px-4 rounded-full border border-white/15 bg-white/[0.04] text-white/80 text-[12.5px] font-bold inline-flex items-center hover:bg-white/[0.08] transition"
              >
                {titleCase(m)} · {groups.get(m)!.length}
              </a>
            ))}
          </div>
        </section>

        {ordered.map(m => (
          <section key={m} id={m.replace(/\s+/g, '-')} className="mx-auto max-w-6xl px-4 sm:px-6 py-8 scroll-mt-20">
            <h2 className="text-[22px] font-extrabold tracking-tight mb-4">{titleCase(m)}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {groups.get(m)!.map(ex => (
                <Link
                  key={ex.id}
                  href={`/exercises/${exerciseSlug(ex)}`}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 hover:bg-white/[0.07] transition flex items-center justify-between gap-3"
                >
                  <span className="text-[14px] font-semibold text-white/90 truncate">{ex.name}</span>
                  <span className="shrink-0 text-[11px] uppercase font-bold tracking-wider text-white/35 capitalize">{ex.level}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
          <div className="rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/[0.07] p-8 text-center">
            <h2 className="text-[24px] font-extrabold tracking-tight">
              Knowing the exercises is the easy part.
            </h2>
            <p className="mt-2 text-[15px] text-white/65 max-w-xl mx-auto">
              The hard part is knowing which ones to do <em>today</em> — for your body, your gear,
              your schedule. The AI coach builds that plan every morning. 14 days free.
            </p>
            <Link
              href="/app/signup"
              className="mt-6 inline-flex h-12 px-8 rounded-full brand-gradient text-white items-center font-bold text-[15px]"
            >
              Get My Daily Plan →
            </Link>
          </div>
          <p className="mt-6 text-[11px] text-white/30 text-center">
            Exercise photos &amp; instructions from the open-source Free Exercise DB (public domain).
          </p>
        </section>
      </main>
      <PublicFooter />
    </>
  )
}
