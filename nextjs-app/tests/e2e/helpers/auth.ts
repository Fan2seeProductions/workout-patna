// Auth helpers for tests. Drives the email/password form on /app/auth.
import type { Page } from '@playwright/test'
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from './test-data'

export async function signIn(page: Page, email = TEST_USER_EMAIL, password = TEST_USER_PASSWORD) {
  await page.goto('/app/auth?mode=signin')
  // Use accessible-name selectors so we don't depend on data-testids.
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/password/i).fill(password)
  await page.getByRole('button', { name: /^sign in$/i }).click()
  // Successful sign-in lands on /app/home (via callback for OAuth, direct for password).
  await page.waitForURL(/\/app\/(home|onboarding)/, { timeout: 15_000 })
}

export async function signOut(page: Page) {
  await page.goto('/app/profile')
  await page.getByRole('button', { name: /log\s*out|sign\s*out/i }).click()
  await page.waitForURL(/\/app(\/auth)?$/, { timeout: 10_000 })
}
