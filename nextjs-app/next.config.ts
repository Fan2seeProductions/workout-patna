import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Strict mode for better React compatibility
  reactStrictMode: true,

  // Disable router segment cache (avoids localStorage access in non-browser envs)
  experimental: {
    staleTimes: { dynamic: 0, static: 0 },
  },

  // Allow Unsplash photos for placeholder content
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',            value: 'DENY' },
          { key: 'X-XSS-Protection',           value: '1; mode=block' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
    ]
  },

  // Send the apex root straight to the app splash.
  async redirects() {
    return [
      { source: '/', destination: '/app', permanent: false },
    ]
  },
}

export default nextConfig
