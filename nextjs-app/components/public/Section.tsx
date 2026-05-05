// Layout helpers shared by every public marketing page.
import type { ReactNode } from 'react'

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="bg-[var(--color-background)]">{children}</main>
}

export function Section({
  id,
  children,
  className = '',
}: {
  id?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 ${className}`}>
      {children}
    </section>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] uppercase font-bold tracking-[0.18em] text-[var(--color-primary)]">
      {children}
    </p>
  )
}

export function H2({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`mt-3 text-[28px] sm:text-[36px] font-extrabold leading-tight tracking-tight text-[var(--color-foreground)] ${className}`}>
      {children}
    </h2>
  )
}

export function Lede({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 text-[16px] sm:text-[17px] leading-relaxed text-[var(--color-muted-foreground)] max-w-2xl">
      {children}
    </p>
  )
}
