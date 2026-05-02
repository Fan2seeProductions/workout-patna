// Tiny class-name combiner. Drop-in replacement for shadcn's cn() so that
// Replit components paste in cleanly.
import clsx, { type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
