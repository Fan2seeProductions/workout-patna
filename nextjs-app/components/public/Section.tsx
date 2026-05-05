// Layout helpers shared by every public marketing page.
// PageShell overrides CSS vars back to light so marketing pages stay
// white/readable regardless of the dark app theme.
import type { ReactNode } from 'react'

const lightVars = {
  '--color-background':    'hsl(0 0% 98%)',
  '--color-foreground':    'hsl(213 13% 14%)',
  '--color-card':          'hsl(0 0% 100%)',
  '--color-card-foreground':'hsl(213 13% 14%)',
  '--color-border':        'hsl(220 13% 91%)',
  '--color-border-bright': 'hsl(220 13% 84%)',
  '--color-muted':         'hsl(210 40% 93%)',
  '--color-muted-foreground':'hsl(223 7% 47%)',
  '--color-text-muted':    'hsl(223 7% 47%)',
  '--color-text-dim':      'hsl(220 9% 60%)',
  '--color-surface':       'hsl(0 0% 100%)',
  '--color-surface-2':     'hsl(216 33% 97%)',
} as React.CSSProperties

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="bg-white text-[hsl(213,13%,14%)]" style={lightVars}>
      {children}
    </main>
  )
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
