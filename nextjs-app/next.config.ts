import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Strict mode for better React compatibility
  reactStrictMode: true,

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

  // Redirects: www → non-www (configure on Vercel DNS instead if possible)
  // async redirects() {
  //   return [
  //     {
  //       source: '/:path*',
  //       has: [{ type: 'host', value: 'www.workoutpatna.com' }],
  //       destination: 'https://workoutpatna.com/:path*',
  //       permanent: true,
  //     },
  //   ]
  // },
}

export default nextConfig
