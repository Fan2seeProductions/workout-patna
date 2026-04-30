import type { Metadata, Viewport } from 'next'
import Script from 'next/script'

// ─── Viewport ────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F26B3A',
}

// ─── Metadata ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL('https://workoutpatna.com'),

  title: {
    default: 'WorkoutPatna — Find Your Gym Partner | Fitness Social Network',
    template: '%s | WorkoutPatna',
  },
  description:
    'WorkoutPatna helps you find workout partners at gyms, apartment fitness centers, community centers, parks, and run clubs in Houston. Build accountability, stay consistent, and connect with local fitness communities.',

  keywords: [
    'find workout partner',
    'gym partner Houston',
    'fitness social network',
    'workout buddy app',
    'gym partner matching',
    'apartment gym partner',
    'fitness accountability partner',
    'run club Houston',
    'Cypress TX gym partner',
    'local fitness community',
    'workout partner near me',
    'fitness friend app',
  ],

  authors: [{ name: 'WorkoutPatna', url: 'https://workoutpatna.com' }],
  creator: 'WorkoutPatna',
  publisher: 'WorkoutPatna',

  // Canonical + alternates
  alternates: {
    canonical: 'https://workoutpatna.com',
  },

  // Open Graph
  openGraph: {
    type: 'website',
    url: 'https://workoutpatna.com',
    siteName: 'WorkoutPatna',
    title: 'WorkoutPatna — Find Your Gym Partner',
    description:
      'Connect with workout partners at gyms, apartment fitness centers, parks, and run clubs near you. WorkoutPatna is the fitness social network built for local communities in Houston.',
    images: [
      {
        url: '/og-image.png',    // place a 1200x630 image in /public
        width: 1200,
        height: 630,
        alt: 'WorkoutPatna — Find Your Gym Partner',
      },
    ],
    locale: 'en_US',
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    title: 'WorkoutPatna — Find Your Gym Partner',
    description:
      'Find workout partners at gyms, apartment fitness centers, parks, and run clubs near you.',
    images: ['/og-image.png'],
    // site: '@workoutpatna',   // uncomment when Twitter handle is live
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // App links / manifest
  manifest: '/manifest.json',   // create this when PWA is ready

  // Verification tags — fill in after claiming properties
  // verification: {
  //   google: 'YOUR_GOOGLE_VERIFICATION_TOKEN',
  //   other: { 'msvalidate.01': 'YOUR_BING_TOKEN' },
  // },
}

// ─── Structured Data ─────────────────────────────────────────────────────────
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'WorkoutPatna',
  url: 'https://workoutpatna.com',
  logo: 'https://workoutpatna.com/logo.png',
  sameAs: [
    // Add social profile URLs as they are created
    // 'https://www.instagram.com/workoutpatna',
    // 'https://twitter.com/workoutpatna',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'hello@workoutpatna.com',  // update to real address
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'WorkoutPatna',
  url: 'https://workoutpatna.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://workoutpatna.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'WorkoutPatna',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'iOS, Android, Web',
  description:
    'WorkoutPatna is a fitness social networking app that helps people find workout partners at gyms, apartment fitness centers, community centers, parks, and run clubs. Connect with local fitness communities, build accountability, and stay consistent.',
  url: 'https://workoutpatna.com',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free to join',
  },
  featureList: [
    'Find gym workout partners near you',
    'Match with fitness accountability partners',
    'Discover apartment fitness center communities',
    'Join local run clubs and outdoor workout groups',
    'Share fitness challenges and goals',
    'Fitness social networking for local communities',
  ],
  // Uncomment when app store links exist:
  // installUrl: 'https://apps.apple.com/...',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is WorkoutPatna?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'WorkoutPatna is a fitness social networking app that helps people find workout partners at local gyms, apartment fitness centers, community centers, parks, and run clubs. It is built for people who want accountability, consistency, and a fitness community — not personal trainers.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does WorkoutPatna help me find a gym partner?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'WorkoutPatna matches you with other members at your gym or nearby fitness locations based on your schedule, goals, and workout preferences. You can browse profiles, connect, and start working out together.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is WorkoutPatna for finding trainers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. WorkoutPatna is not a personal trainer marketplace. It is a social fitness app built for finding workout partners — people like you who want to stay consistent, stay accountable, and enjoy working out with a gym partner or crew.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I find workout partners at my apartment gym?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. WorkoutPatna supports apartment fitness centers, community gyms, and residential fitness spaces so you can connect with neighbors who share your workout routine.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does WorkoutPatna work for run clubs and outdoor workouts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. WorkoutPatna helps you find and join run clubs, outdoor workout groups, and park fitness communities near you.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is WorkoutPatna available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'WorkoutPatna is currently launching in the Houston, Texas area, including Cypress, Katy, Spring, The Woodlands, and surrounding communities.',
      },
    },
  ],
}

// ─── Root Layout ─────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Structured data */}
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          strategy="beforeInteractive"
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          strategy="beforeInteractive"
        />
        <Script
          id="schema-app"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
          strategy="beforeInteractive"
        />
        <Script
          id="schema-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
