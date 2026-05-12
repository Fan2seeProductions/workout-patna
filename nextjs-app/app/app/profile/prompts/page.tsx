// /app/profile/prompts — pick up to 3 Hinge-style prompts to humanize your
// profile. Loads existing answers, hands off to a client-side editor.
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { sanitizePrompts } from '../../../../lib/profile/prompts'
import { PromptsEditor } from './PromptsEditor'
import { ChevronLeft } from 'lucide-react'

export const metadata = { title: 'Profile prompts', robots: { index: false, follow: false } }

export default async function ProfilePromptsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('profile_prompts')
    .eq('id', user.id)
    .maybeSingle()

  const initial = sanitizePrompts(profile?.profile_prompts)

  return (
    <main className="mx-auto max-w-md px-5 pt-5 pb-24" style={{ background: '#0d0d0d', minHeight: '100dvh' }}>
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-5">
          <Link
            href="/app/profile"
            aria-label="Back to profile"
            className="h-9 w-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/85 hover:bg-white/[0.08] transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="text-[13px] font-semibold text-white/60">Profile</span>
        </div>
        <h1 className="text-[26px] font-extrabold tracking-tight">Your prompts</h1>
        <p className="mt-1.5 text-[13px] text-white/50">
          Pick up to 3. These show up on your profile and in the Discover deck —
          this is where personality lives, not stats.
        </p>
      </header>

      <PromptsEditor initial={initial} />
    </main>
  )
}
