// /app/admin/trainers — super-admin screen to review trainer applications.
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { TrainerReviewCard } from './TrainerReviewCard'

export const metadata = { title: 'Review Trainers', robots: { index: false, follow: false } }

export default async function TrainerAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/auth')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'super_admin') {
    return (
      <main className="mx-auto max-w-md px-5 pt-10 text-center">
        <h1 className="text-xl font-extrabold">Access denied</h1>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">Only super admins can review trainer applications.</p>
        <Link href="/app/home" className="mt-4 inline-block text-sm font-bold text-[var(--color-primary)]">Go home</Link>
      </main>
    )
  }

  const { status } = await searchParams
  const filterStatus = status === 'approved' || status === 'rejected' ? status : 'pending'

  const { data: applications } = await supabase
    .from('trainer_applications')
    .select('*, gym:gyms(name, city)')
    .eq('status', filterStatus)
    .order('created_at', { ascending: filterStatus === 'pending' })
    .limit(50)

  const apps = applications ?? []

  const { count: pendingCount } = await supabase
    .from('trainer_applications')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

  return (
    <main className="mx-auto max-w-lg px-5 pt-3 pb-20">
      <header className="flex items-center justify-between py-3">
        <Link href="/app/admin/location" className="text-[13px] font-bold text-[var(--color-primary)]">← Admin</Link>
        <span className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)]">
          Super admin
        </span>
        <span className="w-10" />
      </header>

      <h1 className="text-[24px] font-extrabold tracking-tight">Trainer Applications</h1>
      <p className="mt-1 text-[13px] text-[var(--color-muted-foreground)]">
        Review, approve, or reject trainer sign-ups. Approved trainers appear in the Trainers tab and location hubs.
      </p>

      {/* Status tabs */}
      <div className="mt-4 flex gap-2">
        {(['pending', 'approved', 'rejected'] as const).map(s => (
          <Link
            key={s}
            href={`/app/admin/trainers?status=${s}`}
            className={`px-4 py-1.5 rounded-full text-[12.5px] font-bold capitalize ${
              filterStatus === s
                ? 'brand-gradient text-white'
                : 'border border-[var(--color-border)] text-[var(--color-muted-foreground)]'
            }`}
          >
            {s}
            {s === 'pending' && pendingCount ? ` (${pendingCount})` : ''}
          </Link>
        ))}
      </div>

      {apps.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-[var(--color-border)] p-8 text-center">
          <p className="text-[15px] font-bold text-[var(--color-foreground)]">No {filterStatus} applications</p>
          <p className="mt-1 text-[12.5px] text-[var(--color-muted-foreground)]">
            {filterStatus === 'pending'
              ? 'All caught up. New applications will appear here.'
              : `Switch to another tab to see other applications.`}
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {apps.map((app: any) => (
            <TrainerReviewCard
              key={app.id}
              application={app}
              gymName={app.gym?.name}
              gymCity={app.gym?.city}
              showActions={filterStatus === 'pending'}
            />
          ))}
        </div>
      )}
    </main>
  )
}
