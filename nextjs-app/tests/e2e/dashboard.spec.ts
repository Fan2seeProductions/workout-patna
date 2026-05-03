import { test, expect } from '@playwright/test'
import { signIn } from './helpers/auth'
import { hasTestUser } from './helpers/test-data'

test.describe('Dashboard (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasTestUser(), 'Set TEST_USER_EMAIL + TEST_USER_PASSWORD to run dashboard tests.')
    await signIn(page)
  })

  test('home dashboard renders greeting + daily motivation', async ({ page }) => {
    await page.goto('/app/home')
    await expect(page.getByText(/good (morning|afternoon|evening)/i)).toBeVisible()
    await expect(page.getByText(/daily motivation/i)).toBeVisible()
  })

  test('bottom nav has all 5 tabs and they navigate', async ({ page }) => {
    await page.goto('/app/home')
    for (const [label, urlMatch] of [
      ['Home',       /\/app\/home$/],
      ['Challenges', /\/app\/challenges/],
      ['Find Patna', /\/app\/(browse|discover)/],
      ['Messages',   /\/app\/messages/],
      ['Profile',    /\/app\/profile/],
    ] as const) {
      await page.getByRole('link', { name: new RegExp(label, 'i') }).first().click()
      await page.waitForURL(urlMatch, { timeout: 8_000 })
      expect(page.url()).toMatch(urlMatch)
    }
  })

  test('communities page renders cards or empty state', async ({ page }) => {
    await page.goto('/app/gyms')
    await expect(page.getByRole('heading', { name: /communities/i })).toBeVisible()
    // Either we see one or more location cards or the "no communities found" empty state
    const anyCard = page.getByRole('heading', { level: 3 }).first()
    const empty = page.getByText(/no communities/i).first()
    await expect(anyCard.or(empty)).toBeVisible()
  })

  test('workouts library renders filter pills', async ({ page }) => {
    await page.goto('/app/workouts')
    await expect(page.getByRole('button', { name: /^all$/i }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: /^beginner$/i })).toBeVisible()
  })
})
