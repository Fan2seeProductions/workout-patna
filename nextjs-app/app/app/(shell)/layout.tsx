// App shell layout. Wraps signed-in pages that need the navbar
// (mobile bottom tabs + desktop top header). The AI Coach banner lives in
// the PARENT app/app/layout.tsx so it covers ALL /app/* pages, not just shell.
import type { ReactNode } from 'react'
import { Navbar } from '../../../components/app/Navbar'
import { VerifyEmailBanner } from '../../../components/app/VerifyEmailBanner'
import { createClient } from '../../../lib/supabase/server'

export default async function AppShellLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let userName: string | undefined
  let isPremium = false
  let unreadMessages = 0
  let needsVerification = false

  if (user) {
    const [{ data: profile }, { count }] = await Promise.all([
      supabase
        .from('profiles')
        .select('display_name, is_premium, email_verified_at')
        .eq('id', user.id)
        .maybeSingle(),
      supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .is('read_at', null)
        .neq('sender_id', user.id),
    ])
    userName = profile?.display_name ?? user.email ?? undefined
    isPremium = !!profile?.is_premium
    unreadMessages = count ?? 0
    // Show banner if email_verified_at is not set (email/password users only —
    // Google OAuth users are auto-verified in the migration)
    needsVerification = !profile?.email_verified_at
  }

  return (
    <div className="min-h-dvh pb-20 md:pb-0">
      {needsVerification && <VerifyEmailBanner />}
      {children}
      <Navbar userName={userName} isPremium={isPremium} unreadMessages={unreadMessages} />
    </div>
  )
}
