import type { MetadataRoute } from 'next'

// All public marketing + legal routes. App routes (/app/*) are auth-gated
// and noindexed, so they stay out of the sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://workoutpartna.com'
  const now = new Date()

  return [
    { url: baseUrl,              lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/about`,   lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/safety`,  lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${baseUrl}/waiver`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
  ]
}
