import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

// ─── Viewport ────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#dc1616',
  viewportFit: 'cover',
}

// ─── Metadata ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL('https://workoutpatna.com'),

  title: {
    default: 'WorkoutPartna, Find Your Gym Partner | Fitness Social Network',
    template: '%s | WorkoutPartna',
  },
  description:
    'WorkoutPartna helps you find workout partners at gyms, apartment fitness centers, community centers, parks, and run clubs in Houston. Build accountability, stay consistent, and connect with local fitness communities.',

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

  authors: [{ name: 'WorkoutPartna', url: 'https://workoutpatna.com' }],
  creator: 'WorkoutPartna',
  publisher: 'WorkoutPartna',

  // Canonical + alternates
  alternates: {
    canonical: 'https://workoutpatna.com',
  },

  // Open Graph
  openGraph: {
    type: 'website',
    url: 'https://workoutpatna.com',
    siteName: 'WorkoutPartna',
    title: 'WorkoutPartna, Find Your Gym Partner',
    description:
      'Connect with workout partners at gyms, apartment fitness centers, parks, and run clubs near you. WorkoutPartna is the fitness social network built for local communities in Houston.',
    images: [
      {
        url: '/og-image.png',    // place a 1200x630 image in /public
        width: 1200,
        height: 630,
        alt: 'WorkoutPartna, Find Your Gym Partner',
      },
    ],
    locale: 'en_US',
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    title: 'WorkoutPartna, Find Your Gym Partner',
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

  // PWA / App install
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WorkoutPartna',
  },
  icons: {
    apple: '/brand/logo-square-1024.png',
    icon: '/brand/logo-square-1024.png',
    shortcut: '/brand/logo-square-1024.png',
  },

  // Verification tags, fill in after claiming properties
  // verification: {
  //   google: 'YOUR_GOOGLE_VERIFICATION_TOKEN',
  //   other: { 'msvalidate.01': 'YOUR_BING_TOKEN' },
  // },
}

// ─── Structured Data ─────────────────────────────────────────────────────────
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'WorkoutPartna',
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
    email: 'sales@fan2seeproductions.com',
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'WorkoutPartna',
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
  name: 'WorkoutPartna',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'iOS, Android, Web',
  description:
    'WorkoutPartna is a fitness social networking app that helps people find workout partners at gyms, apartment fitness centers, community centers, parks, and run clubs. Connect with local fitness communities, build accountability, and stay consistent.',
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
      name: 'What is WorkoutPartna?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'WorkoutPartna is a fitness social networking app that helps people find workout partners at local gyms, apartment fitness centers, community centers, parks, and run clubs. It is built for people who want accountability, consistency, and a fitness community, not personal trainers.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does WorkoutPartna help me find a gym partner?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'WorkoutPartna matches you with other members at your gym or nearby fitness locations based on your schedule, goals, and workout preferences. You can browse profiles, connect, and start working out together.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is WorkoutPartna for finding trainers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. WorkoutPartna is not a personal trainer marketplace. It is a social fitness app built for finding workout partners, people like you who want to stay consistent, stay accountable, and enjoy working out with a gym partner or crew.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I find workout partners at my apartment gym?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. WorkoutPartna supports apartment fitness centers, community gyms, and residential fitness spaces so you can connect with neighbors who share your workout routine.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does WorkoutPartna work for run clubs and outdoor workouts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. WorkoutPartna helps you find and join run clubs, outdoor workout groups, and park fitness communities near you.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is WorkoutPartna available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'WorkoutPartna is currently launching in the Houston, Texas area, including Cypress, Katy, Spring, The Woodlands, and surrounding communities.',
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
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Structured data, plain script tags are correct for static JSON-LD in App Router */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
