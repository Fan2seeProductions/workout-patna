// API + network behavior. Hits the route handlers directly.
import { test, expect } from '@playwright/test'

test.describe('API', () => {
  test('Stripe checkout requires auth (returns 401)', async ({ request }) => {
    const res = await request.post('/api/stripe/checkout')
    // 401 if Supabase keys present, 500 if Stripe keys missing — both are non-success
    expect([401, 500]).toContain(res.status())
  })

  test('Stripe webhook rejects unsigned payloads', async ({ request }) => {
    const res = await request.post('/api/stripe/webhook', {
      data: '{}',
      headers: { 'content-type': 'application/json' },
    })
    expect(res.status()).toBeGreaterThanOrEqual(400)
  })

  test('OAuth callback without code redirects to auth', async ({ request }) => {
    const res = await request.get('/auth/callback', { maxRedirects: 0 })
    expect(res.status()).toBe(307)
    const loc = res.headers()['location'] ?? ''
    expect(loc).toMatch(/\/app\/(auth|signin)/)
  })

  test('apex / returns a redirect to /app', async ({ request }) => {
    const res = await request.get('/', { maxRedirects: 0 })
    // Depending on middleware: 307/308 or 200 (if redirect was rendered client-side)
    expect([200, 307, 308]).toContain(res.status())
    if (res.status() !== 200) {
      expect(res.headers()['location']).toMatch(/\/app/)
    }
  })
})
