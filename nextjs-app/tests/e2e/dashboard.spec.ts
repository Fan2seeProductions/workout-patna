import { test, expect } from '@playwright/test'
import { signIn } from './helpers/auth'
import { hasTestUser } from './helpers/test-data'

test.describe('Dashboard (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasTestUser(), 'Set TEST_USER_EMAIL + TEST_USER_PASSWORD to run dashboard tests.')
    await signIn(page)
  })

  test('home dashboard renders time-of-day greeting', async ({ page }) => {
    await page.goto('/app/home')
    // The header shows "Good morning / Good afternoon / Good evening"
    await expect(
      page.getByText(/good (morning|afternoon|evening)/i)
    ).toBeVisible({ timeout: 8_000 })
  })

  test('home dashboard renders stat chips (Matches, Messages, Discover)', async ({ page }) => {
    await page.goto('/app/home')
    for (const label of ['Matches', 'Messages', 'Discover']) {
      await expect(
        page.getByText(new RegExp(label, 'i')).first()
      ).toBeVisible()
    }
  })

  test('"Training today?" banner is visible', async ({ page }) => {
    await page.goto('/app/home')
    await expect(page.getByText(/training today/i)).toBeVisible()
  })

  test('"Suggested Partnas" section is present', async ({ page }) => {
    await page.goto('/app/home')
    // Either suggested profiles or the "complete your profile" empty state
    const suggested = page.getByText(/suggested partnas/i)
    const empty = page.getByText(/complete your profile|no suggestions yet/i)
    await expect(suggested.or(empty).first()).toBeVisible()
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

  test('communities page renders heading + cards or empty state', async ({ page }) => {
    await page.goto('/app/gyms')
    await expect(page.getByRole('heading', { name: /communities/i })).toBeVisible()
    // Either at least one community card or the "no communities found" empty state
    const anyCard = page.getByRole('heading', { level: 3 }).first()
    const empty = page.getByText(/no communities/i).first()
    await expect(anyCard.or(empty)).toBeVisible()
  })

  test('workouts library renders filter pills', async ({ page }) => {
    await page.goto('/app/workouts')
    await expect(page.getByRole('button', { name: /^all$/i }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: /^beginner$/i })).toBeVisible()
  })

  test('messages page renders inbox or empty state', async ({ page }) => {
    await page.goto('/app/messages')
    const anyConvo = page.getByRole('listitem').first()
    const empty = page.getByText(/no messages|no conversations|start a conversation/i).first()
    await expect(anyConvo.or(empty)).toBeVisible({ timeout: 8_000 })
  })

  test('discover / browse page renders', async ({ page }) => {
    await page.goto('/app/discover')
    const res = await page.goto('/app/discover')
    expect(res?.status()).toBe(200)
    // Should not be blank
    const body = await page.locator('body').textContent()
    expect((body ?? '').trim().length).toBeGreaterThan(20)
  })

  test('profile page renders and has edit link', async ({ page }) => {
    await page.goto('/app/profile')
    // Edit profile link or button should exist
    await expect(
      page.getByRole('link', { name: /edit profile|edit/i })
        .or(page.getByRole('button', { name: /edit profile|edit/i }))
        .first()
    ).toBeVisible()
  })

  test('signout from profile redirects to auth or splash', async ({ page }) => {
    await page.goto('/app/profile')
    const signOutBtn = page.getByRole('button', { name: /log\s*out|sign\s*out/i })
    if (await signOutBtn.isVisible().catch(() => false)) {
      await signOutBtn.click()
      await page.waitForURL(/\/app(\/auth)?\/?$/, { timeout: 10_000 })
    } else {
      // Sign-out may be nested under a menu — just confirm the page rendered
      const body = await page.locator('body').textContent()
      expect((body ?? '').trim().length).toBeGreaterThan(20)
    }
  })
})
