// App shell layout. Wraps every signed-in page with the navbar
// (mobile bottom tabs + desktop top header).
import type { ReactNode } from 'react'
import { Navbar } from '../../../components/app/Navbar'
import { createClient } from '../../../lib/supabase/server'

export default async function AppShellLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let userName: string | undefined
  let isPremium = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, is_premium')
      .eq('id', user.id)
      .maybeSingle()
    userName = profile?.display_name ?? user.email ?? undefined
    isPremium = !!profile?.is_premium
  }

  return (
    <div className="min-h-dvh pb-20 md:pb-0">
      {children}
      <Navbar userName={userName} isPremium={isPremium} />
    </div>
  )
}
