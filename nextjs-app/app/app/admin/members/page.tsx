// /app/admin/members — full member list for the WorkoutPartna owner.
// Only accessible to accounts in the ADMIN_EMAILS env var.
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ShieldCheck, Mail, Globe } from 'lucide-react'
import { createClient } from '../../../../lib/supabase/server'
import { createAdminClient } from '../../../../lib/supabase/admin'

export const metadata = { title: 'Members · Admin', robots: { index: false, follow: false } }

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'sales@fan2seeproductions.com,dwilliams@fan2seeproductions.com')
  .split(',').map(e => e.trim().toLowerCase())

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime()
  const m = Math.floor(ms / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function fmt(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export default async function AdminMembersPage() {
  // User session ONLY for the admin gate. All member data is read with the
  // service-role client below — the admin's own RLS would otherwise hide every
  // other member's row, and admin_get_auth_users is REVOKE'd from authenticated.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')
  if (!ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')) redirect('/app/home')

  const admin = createAdminClient()
  if (!admin) redirect('/app/home')

  // Pull profiles joined with auth data via a view-friendly query
  const { data: profiles } = await admin
    .from('profiles')
    .select('id, display_name, email_verified_at, is_premium, created_at, gym_id, goals, styles, photo_url')
    .order('created_at', { ascending: false })

  // Pull auth.users for email + provider + last_sign_in via separate query.
  const { data: authUsers } = await admin
    .rpc('admin_get_auth_users')
    .select('*')

  // Build lookup by id
  const authMap = new Map<string, { email: string; provider: string; last_sign_in_at: string | null; created_at: string }>()
  if (authUsers) {
    for (const u of authUsers as Array<{ id: string; email: string; provider: string; last_sign_in_at: string | null; created_at: string }>) {
      authMap.set(u.id, u)
    }
  }

  const total = profiles?.length ?? 0
  const verified = (profiles ?? []).filter(p => p.email_verified_at).length
  const premium  = (profiles ?? []).filter(p => p.is_premium).length

  return (
    <main className="mx-auto max-w-2xl px-4 pt-5 pb-24" style={{ background: '#0d0d0d', minHeight: '100dvh' }}>

      {/* Header */}
      <header className="flex items-center gap-3 mb-6">
        <Link
          href="/app/home"
          className="h-9 w-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/[0.08] transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] mb-0.5">Admin</p>
          <h1 className="text-[22px] font-extrabold tracking-tight text-white">Members</h1>
        </div>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total', value: total },
          { label: 'Verified', value: verified },
          { label: 'Premium', value: premium },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-[26px] font-extrabold text-white">{s.value}</p>
            <p className="text-[11px] text-white/40 font-semibold uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Member list */}
      <div className="space-y-2">
        {(profiles ?? []).map((p, i) => {
          const auth = authMap.get(p.id)
          const isGoogle = auth?.provider === 'google'
          const initial = (p.display_name ?? '?')[0]?.toUpperCase()

          return (
            <Link
              key={p.id}
              href={`/app/admin/members/${p.id}`}
              className="flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] rounded-2xl p-3.5 transition"
            >
              {/* Avatar */}
              <div className="shrink-0 h-11 w-11 rounded-full overflow-hidden bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-extrabold text-[15px]">
                {p.photo_url
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={p.photo_url} alt="" className="w-full h-full object-cover" />
                  : initial}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[14px] text-white truncate">
                    {p.display_name ?? 'No name'}
                  </p>
                  {p.is_premium && (
                    <span className="shrink-0 text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300">PRO</span>
                  )}
                </div>
                <p className="text-[12px] text-white/40 truncate mt-0.5">
                  {auth?.email ?? '—'}
                </p>
              </div>

              {/* Right side */}
              <div className="shrink-0 text-right space-y-1">
                <div className="flex items-center justify-end gap-1.5">
                  {isGoogle
                    ? <Globe className="w-3 h-3 text-blue-400" />
                    : <Mail className="w-3 h-3 text-white/30" />}
                  {p.email_verified_at && (
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  )}
                </div>
                <p className="text-[11px] text-white/30 font-medium">
                  {auth?.created_at ? timeAgo(auth.created_at) : fmt(p.created_at)}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
