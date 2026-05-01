// App shell layout — wraps every signed-in page with the bottom nav.
import type { ReactNode } from 'react'
import { BottomNav } from '../../../components/app/BottomNav'

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh pb-20">
      {children}
      <BottomNav />
    </div>
  )
}
