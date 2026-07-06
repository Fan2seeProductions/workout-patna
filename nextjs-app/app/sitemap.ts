import type { MetadataRoute } from 'next'
import { allExercises, exerciseSlug } from '../lib/exercises/match'

// All public marketing + legal routes plus the exercise library. App routes
// (/app/*) are auth-gated and noindexed, so they stay out of the sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://workoutpartna.com'
  const now = new Date()

  const core: MetadataRoute.Sitemap = [
    { url: baseUrl,                 lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/pricing`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/about`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/exercises`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/safety`,     lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${baseUrl}/privacy`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${baseUrl}/waiver`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
  ]

  const exercises: MetadataRoute.Sitemap = allExercises().map(ex => ({
    url: `${baseUrl}/exercises/${exerciseSlug(ex)}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.4,
  }))

  return [...core, ...exercises]
}
