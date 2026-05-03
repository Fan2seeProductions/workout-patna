import { test, expect } from '@playwright/test'
import { hasTestUser, TEST_USER_EMAIL, TEST_USER_PASSWORD } from './helpers/test-data'

test.describe('Auth', () => {
  test('/app/auth shows the sign-in form by default', async ({ page }) => {
    await page.goto('/app/auth')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /^sign in$/i })).toBeVisible()
    await expect(
      page.getByRole('link', { name: /sign in with google|continue with google/i })
        .or(page.getByRole('button', { name: /sign in with google|continue with google/i }))
    ).toBeVisible()
  })

  test('/app/auth?mode=signup switches to create-account state', async ({ page }) => {
    await page.goto('/app/auth?mode=signup')
    await expect(
      page.getByRole('button', { name: /create account|get started|sign up/i }).first(),
    ).toBeVisible()
  })

  test('/app/signin redirects to /app/auth', async ({ page }) => {
    await page.goto('/app/signin')
    await page.waitForURL(/\/app\/auth/)
    expect(page.url()).toMatch(/\/app\/auth/)
  })

  test('/app/signup redirects to /app/auth', async ({ page }) => {
    await page.goto('/app/signup')
    await page.waitForURL(/\/app\/auth/)
    expect(page.url()).toMatch(/\/app\/auth/)
  })

  test('invalid credentials surface an error', async ({ page }) => {
    await page.goto('/app/auth?mode=signin')
    await page.getByLabel(/email/i).fill('definitely-not-a-real-account@workoutpartna.test')
    await page.getByLabel(/password/i).fill('wrong-password-123')
    await page.getByRole('button', { name: /^sign in$/i }).click()
    // Surface either an inline error or stay on the auth page (no nav).
    await expect.poll(async () => {
      const stillOnAuth = /\/app\/auth/.test(page.url())
      const errorVisible = await page.getByText(/invalid|incorrect|not configured|wrong/i)
        .first().isVisible().catch(() => false)
      return stillOnAuth && errorVisible ? 'shown' : 'pending'
    }, { timeout: 10_000 }).toBe('shown')
  })

  test('valid credentials sign in and reach /app/home', async ({ page }) => {
    test.skip(!hasTestUser(), 'Set TEST_USER_EMAIL + TEST_USER_PASSWORD env vars to run.')
    await page.goto('/app/auth?mode=signin')
    await page.getByLabel(/email/i).fill(TEST_USER_EMAIL)
    await page.getByLabel(/password/i).fill(TEST_USER_PASSWORD)
    await page.getByRole('button', { name: /^sign in$/i }).click()
    await page.waitForURL(/\/app\/(home|onboarding)/, { timeout: 15_000 })
  })

  test('/auth/callback without code redirects to auth with error', async ({ page }) => {
    const res = await page.goto('/auth/callback?error=test', { waitUntil: 'commit' })
    // Either 307 + landing on signin, or following redirect to /app/auth | /app/signin
    await page.waitForURL(/\/app\/(auth|signin)/, { timeout: 5_000 })
    expect(res?.status() ?? 200).toBeLessThan(500)
  })
})
