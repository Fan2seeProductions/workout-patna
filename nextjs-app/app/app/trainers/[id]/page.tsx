// /app/trainers/[id] — public-style trainer profile inside the app shell.
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { ConsultationForm } from './ConsultationForm'

export const metadata = { title: 'Trainer', robots: { index: false, follow: false } }

export default async function TrainerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const [{ data: trainer }, { data: gym }] = await Promise.all([
    supabase.from('trainers').select('*').eq('id', id).maybeSingle(),
    // Eagerly fetch gym after we have trainer.gym_id
    Promise.resolve({ data: null as null | { id: string; name: string; city: string; state: string } }),
  ])

  if (!trainer || !trainer.is_active) notFound()

  let gymRow: { id: string; name: string; city: string; state: string } | null = gym
  if (trainer.gym_id) {
    const { data } = await supabase.from('gyms').select('id, name, city, state').eq('id', trainer.gym_id).maybeSingle()
    gymRow = data ?? null
  }

  return (
    <main className="mx-auto max-w-md px-5 pt-3 pb-20">
      <header className="flex items-center justify-between py-3">
        <Link href="/app/discover" className="text-[13px] font-bold text-[var(--color-primary)]">
          ← Back
        </Link>
        <span className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)]">
          Trainer
        </span>
        <span className="w-10" />
      </header>

      {/* Hero */}
      <section className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04]">
        <div className="h-32 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]" />
        <div className="px-5 -mt-12 pb-5">
          <div className="h-24 w-24 rounded-2xl border-4 border-white overflow-hidden bg-[var(--color-muted)] shadow-md">
            {trainer.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={trainer.photo_url} alt={trainer.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-3xl font-extrabold text-[var(--color-primary)]">
                {trainer.name[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="mt-3 text-[24px] font-extrabold tracking-tight text-[var(--color-foreground)]">{trainer.name}</h1>
          {gymRow && (
            <p className="mt-0.5 text-[12.5px] text-[var(--color-muted-foreground)]">
              📍 {gymRow.name} · {[gymRow.city, gymRow.state].filter(Boolean).join(', ')}
            </p>
          )}
          {(trainer.specialties ?? []).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(trainer.specialties as string[]).map(s => (
                <span key={s} className="px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[11px] font-bold">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {trainer.bio && (
        <section className="mt-5">
          <h2 className="text-[12px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)] mb-2">About</h2>
          <p className="text-[14px] text-[var(--color-foreground)] leading-relaxed">{trainer.bio}</p>
        </section>
      )}

      {/* Pricing placeholder */}
      <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)]">Pricing</p>
        <p className="mt-1 text-[13.5px] text-[var(--color-foreground)]">Contact for pricing</p>
        <p className="mt-1 text-[11.5px] text-[var(--color-muted-foreground)]">
          First consultation is free for WorkoutPartna members.
        </p>
      </section>

      {/* Consultation form */}
      <section id="consult" className="mt-6">
        <h2 className="text-[12px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)] mb-2">
          Free consultation
        </h2>
        <ConsultationForm trainerId={trainer.id} bookingLink={trainer.booking_link} />
      </section>
    </main>
  )
}
