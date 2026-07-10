// /exercises/[slug] — single exercise how-to page: photos, muscles, level,
// equipment, numbered instructions, HowTo structured data, related moves,
// and the coach CTA. Statically generated for all 868 exercises.
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PublicNav } from '../../../components/public/PublicNav'
import { PublicFooter } from '../../../components/public/PublicFooter'
import {
  allExercises, exerciseSlug, getExerciseBySlug, relatedExercises, exerciseImageUrl,
} from '../../../lib/exercises/match'

export function generateStaticParams() {
  return allExercises().map(ex => ({ slug: exerciseSlug(ex) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const ex = getExerciseBySlug(slug)
  if (!ex) return {}
  const muscles = ex.primaryMuscles.join(', ')
  return {
    title: `How to Do ${ex.name} — Form, Photos & Instructions`,
    description: `Step-by-step ${ex.name} guide with photos: targets ${muscles || 'multiple muscles'}, ${ex.level} level${ex.equipment ? `, ${ex.equipment}` : ''}. Free from the WorkoutPartna exercise library.`,
    alternates: { canonical: `https://workoutpartna.com/exercises/${slug}` },
    openGraph: {
      title: `How to Do ${ex.name}`,
      images: ex.images[0] ? [exerciseImageUrl(ex.images[0])] : undefined,
    },
  }
}

function titleCase(s: string) {
  return s.replace(/\b\w/g, c => c.toUpperCase())
}

export default async function ExercisePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ex = getExerciseBySlug(slug)
  if (!ex) notFound()

  const related = relatedExercises(ex)
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to do ${ex.name}`,
    description: `Step-by-step instructions for ${ex.name} with photos.`,
    image: ex.images.map(exerciseImageUrl),
    step: ex.instructions.map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text,
    })),
  }

  // Mirrors the visible breadcrumb nav below — helps these pages win
  // breadcrumb rich results and gives crawlers the site hierarchy.
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://workoutpartna.com' },
      { '@type': 'ListItem', position: 2, name: 'Exercise Library', item: 'https://workoutpartna.com/exercises' },
      { '@type': 'ListItem', position: 3, name: ex.name, item: `https://workoutpartna.com/exercises/${slug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PublicNav />
      <main className="bg-[#0d0d0d] text-white min-h-screen">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 pb-16">
          <nav className="text-[12.5px] text-white/45 font-semibold">
            <Link href="/exercises" className="hover:text-white/80 transition">Exercise Library</Link>
            <span className="mx-1.5">/</span>
            <span className="text-white/70">{ex.name}</span>
          </nav>

          <h1 className="mt-4 text-[30px] sm:text-[38px] font-extrabold leading-[1.08] tracking-tight">
            How to do: {ex.name}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {ex.primaryMuscles.map(m => (
              <span key={m} className="h-8 px-3.5 rounded-full bg-[var(--color-primary)]/12 border border-[var(--color-primary)]/40 text-[var(--color-primary)] text-[12px] font-bold inline-flex items-center">
                {titleCase(m)}
              </span>
            ))}
            <span className="h-8 px-3.5 rounded-full bg-white/[0.05] border border-white/15 text-white/70 text-[12px] font-bold inline-flex items-center capitalize">
              {ex.level}
            </span>
            {ex.equipment && (
              <span className="h-8 px-3.5 rounded-full bg-white/[0.05] border border-white/15 text-white/70 text-[12px] font-bold inline-flex items-center capitalize">
                {ex.equipment}
              </span>
            )}
          </div>

          {/* Photos: start + finish position */}
          <div className={`mt-7 grid gap-3 ${ex.images.length > 1 ? 'sm:grid-cols-2' : ''}`}>
            {ex.images.map((img, i) => (
              <figure key={img} className="rounded-2xl overflow-hidden bg-white border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={exerciseImageUrl(img)}
                  alt={`${ex.name} — ${i === 0 ? 'starting' : 'finishing'} position`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="w-full aspect-[853/567] object-cover"
                />
                <figcaption className="bg-[#141414] text-white/50 text-[11px] uppercase font-bold tracking-wider px-3 py-2">
                  {i === 0 ? 'Start position' : 'Finish position'}
                </figcaption>
              </figure>
            ))}
          </div>

          <h2 className="mt-9 text-[20px] font-extrabold tracking-tight">Step-by-step instructions</h2>
          <ol className="mt-4 space-y-3.5">
            {ex.instructions.map((step, i) => (
              <li key={i} className="flex gap-3.5 text-[15px] text-white/85 leading-relaxed">
                <span className="shrink-0 h-7 w-7 rounded-full bg-[var(--color-primary)] text-white text-[13px] font-black flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          {/* Coach CTA */}
          <div className="mt-11 rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/[0.07] p-6">
            <h2 className="text-[19px] font-extrabold tracking-tight">
              Should <em>you</em> be doing {ex.name} today?
            </h2>
            <p className="mt-1.5 text-[14px] text-white/65 leading-relaxed">
              Depends on your goals, your equipment, and how yesterday went. The WorkoutPartna AI
              coach builds one plan every morning that answers that for you — sets, reps, and all.
              14 days free.
            </p>
            <Link
              href="/app/signup"
              className="mt-4 inline-flex h-11 px-6 rounded-full brand-gradient text-white items-center font-bold text-[14px]"
            >
              Build My Plan →
            </Link>
          </div>

          {related.length > 0 && (
            <section className="mt-11">
              <h2 className="text-[16px] font-extrabold tracking-tight mb-3">
                More {titleCase(ex.primaryMuscles[0] ?? '')} exercises
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {related.map(r => (
                  <Link
                    key={r.id}
                    href={`/exercises/${exerciseSlug(r)}`}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 hover:bg-white/[0.07] transition text-[13.5px] font-semibold text-white/85 truncate"
                  >
                    {r.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <p className="mt-10 text-[11px] text-white/30">
            Photos &amp; base instructions from the open-source Free Exercise DB (public domain).
          </p>
        </article>
      </main>
      <PublicFooter />
    </>
  )
}
