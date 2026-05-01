// Placeholder for screens that aren't built yet.
import { Logo } from './Logo'

export function ComingSoon({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <main className="mx-auto max-w-md px-6 pt-6 min-h-[calc(100dvh-5rem)] flex flex-col">
      <header className="flex items-center justify-between py-2">
        <Logo size={28} withWordmark />
      </header>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="h-20 w-20 rounded-3xl brand-gradient flex items-center justify-center text-4xl shadow-[0_8px_32px_-4px_rgba(59,130,246,0.4)]">
          🛠️
        </div>
        <h1 className="mt-6 text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)] max-w-xs">
          {subtitle ?? 'This screen is being built. The Home dashboard is the showcase for now.'}
        </p>
      </div>
    </main>
  )
}
