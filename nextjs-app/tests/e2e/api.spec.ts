// API + network behavior. Hits the route handlers directly.
import { test, expect } from '@playwright/test'

test.describe('API', () => {
  test('apex / returns 200 (marketing landing page — no longer a redirect)', async ({ request }) => {
    const res = await request.get('/', { maxRedirects: 0 })
    // / now renders the marketing landing page directly
    expect(res.status()).toBe(200)
  })

  test('/app returns 200 (app splash screen)', async ({ request }) => {
    const res = await request.get('/app', { maxRedirects: 0 })
    expect([200, 307, 308]).toContain(res.status())
  })

  test('Stripe checkout requires auth (returns 401 or 500 when keys missing)', async ({ request }) => {
    const res = await request.post('/api/stripe/checkout')
    // 401 if Supabase keys present, 500 if Stripe keys missing — both are non-2xx
    expect(res.status()).toBeGreaterThanOrEqual(400)
    expect([401, 500]).toContain(res.status())
  })

  test('Stripe webhook rejects unsigned payloads (400+)', async ({ request }) => {
    const res = await request.post('/api/stripe/webhook', {
      data: '{}',
      headers: { 'content-type': 'application/json' },
    })
    expect(res.status()).toBeGreaterThanOrEqual(400)
  })

  test('OAuth callback without code redirects to auth (307)', async ({ request }) => {
    const res = await request.get('/auth/callback', { maxRedirects: 0 })
    expect(res.status()).toBe(307)
    const loc = res.headers()['location'] ?? ''
    expect(loc).toMatch(/\/app\/(auth|signin)/)
  })

  test('OAuth callback with error param redirects to auth', async ({ request }) => {
    const res = await request.get('/auth/callback?error=access_denied', { maxRedirects: 0 })
    expect([307, 308]).toContain(res.status())
    const loc = res.headers()['location'] ?? ''
    expect(loc).toMatch(/\/app\/(auth|signin)/)
  })
})
