// Premium-feeling button with brand gradient or outline variants.
import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const base =
  'inline-flex items-center justify-center gap-2 font-semibold text-base rounded-full transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none'

const sizes = {
  md: 'h-12 px-6',
  lg: 'h-14 px-8 text-[17px]',
} as const

const variants: Record<Variant, string> = {
  primary:
    'brand-gradient text-white shadow-[0_8px_24px_-4px_rgba(59,130,246,0.45)] hover:brightness-110',
  secondary:
    'bg-white/[0.06] text-white border border-white/15 backdrop-blur-md hover:bg-white/[0.1]',
  ghost: 'text-white/80 hover:text-white hover:bg-white/[0.05]',
}

type Props = {
  variant?: Variant
  size?: keyof typeof sizes
  href?: string
  children: ReactNode
} & Omit<ComponentProps<'button'>, 'children'>

export function BrandButton({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  children,
  ...rest
}: Props) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}
