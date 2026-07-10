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
  metadataBase: new URL('https://workoutpartna.com'),

  title: {
    default: 'WorkoutPartna | AI Daily Coach That Adapts to Your Life',
    template: '%s | WorkoutPartna',
  },
  description:
    'WorkoutPartna is an AI coach that builds you a new workout every day — for the desk, the hotel, or the gym — based on how you\'re actually doing. Delivered by app, text, or a voice call that reads it to you.',

  keywords: [
    'AI workout coach',
    'daily workout generator',
    'AI personal trainer app',
    'desk workout app',
    'adaptive workout plan',
    'AI fitness coach',
    'home workout AI',
    'no equipment workout app',
    'personalized daily workout',
    'AI training plan',
    'Houston AI coach',
    'workout app for busy professionals',
  ],

  authors: [{ name: 'WorkoutPartna', url: 'https://workoutpartna.com' }],
  creator: 'WorkoutPartna',
  publisher: 'WorkoutPartna',

  // Canonical + alternates
  alternates: {
    canonical: 'https://workoutpartna.com',
  },

  // Open Graph
  openGraph: {
    type: 'website',
    url: 'https://workoutpartna.com',
    siteName: 'WorkoutPartna',
    title: 'WorkoutPartna | AI Daily Coach That Adapts to Your Life',
    description:
      'One AI-built workout every day, made for your time, gear, and energy. No planning, no guesswork, no generic program.',
    images: [
      {
        url: '/og-image.jpg',    // place a 1200x630 image in /public
        width: 1200,
        height: 630,
        alt: 'WorkoutPartna — AI Daily Coach',
      },
    ],
    locale: 'en_US',
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    title: 'WorkoutPartna | AI Daily Coach That Adapts to Your Life',
    description:
      'One AI-built workout every day, made for your time, gear, and energy.',
    images: ['/og-image.jpg'],
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

  // Search-engine ownership verification. Tokens come from env so claiming
  // the property is a Vercel-env change, not a code change:
  //   GOOGLE_SITE_VERIFICATION — Google Search Console → HTML-tag method
  //   BING_SITE_VERIFICATION   — Bing Webmaster Tools  → meta-tag method
  ...(process.env.GOOGLE_SITE_VERIFICATION || process.env.BING_SITE_VERIFICATION
    ? {
        verification: {
          ...(process.env.GOOGLE_SITE_VERIFICATION
            ? { google: process.env.GOOGLE_SITE_VERIFICATION }
            : {}),
          ...(process.env.BING_SITE_VERIFICATION
            ? { other: { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } }
            : {}),
        },
      }
    : {}),
}

// ─── Structured Data ─────────────────────────────────────────────────────────
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'WorkoutPartna',
  url: 'https://workoutpartna.com',
  logo: 'https://workoutpartna.com/logo.png',
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
  url: 'https://workoutpartna.com',
  publisher: { '@type': 'Organization', name: 'WorkoutPartna' },
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'WorkoutPartna',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'iOS, Android, Web',
  description:
    'WorkoutPartna is an AI daily coach that builds a new personalized workout every day, adapted to your equipment, time, and how you\'re actually doing — delivered by app, text, or a voice call that reads it to you.',
  url: 'https://workoutpartna.com',
  offers: {
    '@type': 'Offer',
    price: '9.99',
    priceCurrency: 'USD',
    description: '$9.99/month subscription with a 14-day free trial',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '9.99',
      priceCurrency: 'USD',
      billingDuration: 'P1M',
    },
  },
  featureList: [
    'AI-generated daily workout, personalized to your goals and equipment',
    'Adapts to yesterday\'s effort and feedback — harder, easier, or a deload',
    'Desk, hotel, and no-equipment workout variants',
    'Delivered by app, push notification, text, or voice call',
    'Daily streak and progress tracking',
    'Coach chat for questions and workout adjustments',
  ],
  // Uncomment when app store links exist:
  // installUrl: 'https://apps.apple.com/...',
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
        {/* FAQPage schema lives on the homepage (app/page.tsx) where the FAQ is
            actually visible — Google requires the markup to match on-page
            content, so it must not be injected site-wide from here. */}
      </head>
      <body>{children}</body>
    </html>
  )
}
