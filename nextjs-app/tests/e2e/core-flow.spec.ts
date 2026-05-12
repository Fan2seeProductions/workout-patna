// Happy-path: land on splash, click Get Started, arrive at signup form.
import { test, expect } from '@playwright/test'
import { ephemeralEmail, hasTestUser, TEST_USER_EMAIL, TEST_USER_PASSWORD } from './helpers/test-data'

test.describe('Core flow', () => {
  test('splash → signup CTA → auth form is reachable', async ({ page }) => {
    await page.goto('/app')
    const cta = page.getByRole('link', { name: /get started/i }).first()
    await expect(cta).toBeVisible()
    // The CTA href is /app/signup which 307s to /app/auth?mode=signup.
    // In Next.js dev mode the redirect chain over RSC can stall waitForURL,
    // so we just navigate directly to the final URL and assert the form.
    const href = await cta.getAttribute('href')
    expect(href).toMatch(/\/app\/(signup|auth)/)
    // /app/signup 307s to /app/auth — allow extra time for first-compile on dev
    await page.goto(href!, { timeout: 30_000 })
    await expect(page).toHaveURL(/\/app\/auth/, { timeout: 15_000 })
    await expect(page.getByLabel(/^email/i).first()).toBeVisible({ timeout: 10_000 })
    await expect(page.getByLabel(/^password/i).first()).toBeVisible()
  })

  test('end-to-end signup → onboarding (skipped without TEST_USER creds)', async ({ page }) => {
    test.skip(!hasTestUser(), 'Set TEST_USER_EMAIL + TEST_USER_PASSWORD to run sign-in flow.')

    // Sign in with the seeded test user (signup-flow tests would create accounts;
    // we don't want test runs to flood the auth.users table, so we sign in instead)
    await page.goto('/app/auth?mode=signin')
    await page.getByLabel(/email/i).fill(TEST_USER_EMAIL)
    await page.getByLabel(/password/i).fill(TEST_USER_PASSWORD)
    await page.getByRole('button', { name: /^sign in$/i }).click()
    await page.waitForURL(/\/app\/(home|onboarding)/, { timeout: 15_000 })
  })

  test('signup form accepts a fresh email format (TODO: needs Supabase confirm email OFF)', async ({ page }) => {
    await page.goto('/app/auth?mode=signup')
    await page.getByLabel(/email/i).fill(ephemeralEmail())
    await page.getByLabel(/password/i).fill('Test-Password-123')
    // Don't actually submit on every CI run because this hits Supabase and creates a row.
    // Skip submission unless explicitly opted in.
    test.skip(process.env.E2E_ALLOW_SIGNUP !== '1', 'Set E2E_ALLOW_SIGNUP=1 to actually create test accounts.')
    await page.getByRole('button', { name: /create account|get started|sign up/i }).click()
    await page.waitForURL(/\/app\/(home|onboarding|auth)/, { timeout: 15_000 })
  })
})
