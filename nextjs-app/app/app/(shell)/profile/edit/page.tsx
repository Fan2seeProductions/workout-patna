// Profile / Settings page.
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '../../../../../lib/supabase/server'
import { Logo } from '../../../../../components/app/Logo'
import { ProfileSettings } from './ProfileSettings'
import { DeleteAccountSection } from './DeleteAccountSection'
import { signOut } from '../../../../../lib/actions/profile'

export const metadata = { title: 'Profile', robots: { index: false, follow: false } }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <main className="mx-auto max-w-md px-5 pt-3 pb-6">
      <header className="flex items-center justify-between py-3">
        <Logo size={26} withWordmark />
      </header>

      <ProfileSettings
        profile={profile ?? { id: user.id }}
        email={user.email ?? ''}
      />

      <section className="mt-8 space-y-3">
        <Link
          href="/app/coach"
          className="block glass-card p-4 hover:border-[var(--color-border-bright)] transition"
        >
          <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-cyan)]">
            Premium
          </p>
          <p className="mt-1 font-bold">AI Daily Coach</p>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">
            Manage your subscription, intake, and preferences.
          </p>
        </Link>

        <form action={signOut}>
          <button
            type="submit"
            className="w-full h-12 rounded-2xl border border-[var(--color-border)] bg-white/[0.03] text-[14px] font-semibold text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
          >
            Sign out
          </button>
        </form>

        <DeleteAccountSection />

        <p className="text-center text-[11px] text-[var(--color-text-dim)]">
          Signed in as {user.email}
        </p>
      </section>
    </main>
  )
}
