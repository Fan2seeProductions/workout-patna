// Image with onError fallback. Used by the splash to prefer a local file
// (/photos/splash.jpg) and fall back to an Unsplash URL when not present.
'use client'

import { useState } from 'react'

export function HeroImage({
  src,
  fallback,
  alt,
  className = '',
}: {
  src: string
  fallback: string
  alt: string
  className?: string
}) {
  const [current, setCurrent] = useState(src)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      onError={() => {
        if (current !== fallback) setCurrent(fallback)
      }}
    />
  )
}
