import { test, expect } from '@playwright/test'

// Note: /app/home does NOT redirect anonymous users — it renders a
// "Welcome, Friend" empty-state on purpose so the splash content keeps
// flowing for first-time visitors. Auth gating happens on the data-bearing
// pages below.
const PROTECTED_ROUTES = [
  '/app/browse',
  '/app/discover',
  '/app/messages',
  '/app/profile',
  '/app/challenges',
  '/app/gyms',
  '/app/workouts',
  '/app/merch',
  '/app/notifications',
  '/app/onboarding',
  '/app/coach',
] as const

test.describe('Protected routes', () => {
  for (const path of PROTECTED_ROUTES) {
    test(`anonymous request to ${path} redirects to auth`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'commit' })
      // Some routes redirect to /app/auth, /app/signin, or even /app (splash).
      // All three are acceptable "kicked out" outcomes for an unauthenticated user.
      await page.waitForURL(/\/app(\/auth|\/signin|\/?$)/, { timeout: 8_000 })
      const url = page.url()
      const acceptable = /\/app\/(auth|signin)|\/app\/?$/.test(url)
      expect(acceptable, `landed at ${url}, expected /app/auth or /app/signin`).toBe(true)
    })
  }
})
