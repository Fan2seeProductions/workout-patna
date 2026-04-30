import type { MetadataRoute } from 'next'

// Only include confirmed public routes.
// Add additional routes here as pages are built and confirmed public.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://workoutpatna.com'
  const now = new Date()

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // Uncomment as pages are confirmed and built:
    // {
    //   url: `${baseUrl}/browse`,
    //   lastModified: now,
    //   changeFrequency: 'daily',
    //   priority: 0.9,
    // },
    // {
    //   url: `${baseUrl}/gyms`,
    //   lastModified: now,
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
    // {
    //   url: `${baseUrl}/houston`,
    //   lastModified: now,
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
  ]
}
