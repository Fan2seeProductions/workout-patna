// Smoke tests. Public routes should all load without console errors,
// without blank screens, and with their key CTAs visible.
import { test, expect } from '@playwright/test'

test.describe('Smoke · Marketing site', () => {
  test('marketing landing page (/) renders headline + CTAs', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()))

    const res = await page.goto('/')
    expect(res?.status()).toBe(200)

    // Not a blank screen
    const body = await page.locator('body').textContent()
    expect((body ?? '').trim().length).toBeGreaterThan(50)

    // Punchy headline copy
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/stop training|find your|alone/i)

    // Primary CTA
    await expect(
      page.getByRole('link', { name: /find my partna|get started|find your partna/i }).first()
    ).toBeVisible()

    // Nav is present
    await expect(page.getByRole('navigation').first()).toBeVisible()

    // Filter known harmless noise (Next.js favicon, fonts)
    const real = errors.filter(e =>
      !/favicon/i.test(e) &&
      !/Failed to load resource/i.test(e) &&
      !/google-fonts/i.test(e) &&
      !/hero-woman/i.test(e),
    )
    expect(real, `console errors:\n${real.join('\n')}`).toHaveLength(0)
  })

  test('nav links on marketing page are all visible', async ({ page }) => {
    await page.goto('/')
    for (const label of ['About', 'Pricing']) {
      await expect(
        page.getByRole('navigation').getByRole('link', { name: new RegExp(label, 'i') }).first()
      ).toBeVisible()
    }
  })
})

test.describe('Smoke · App splash (/app)', () => {
  test('app splash renders with primary CTAs', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()))

    await page.goto('/app')

    // Not a blank screen
    const body = await page.locator('body').textContent()
    expect((body ?? '').trim().length).toBeGreaterThan(20)

    // "Get Started" CTA
    await expect(page.getByRole('link', { name: /get started/i }).first()).toBeVisible()

    // Already-have-account CTA
    await expect(page.getByRole('link', { name: /i already have|sign in/i }).first()).toBeVisible()

    // Filter known harmless noise
    const real = errors.filter(e =>
      !/favicon/i.test(e) &&
      !/Failed to load resource/i.test(e) &&
      !/google-fonts/i.test(e) &&
      !/hero-woman/i.test(e),
    )
    expect(real, `console errors:\n${real.join('\n')}`).toHaveLength(0)
  })
})

test.describe('Smoke · About page', () => {
  test('/about renders with heading and "How it works" section', async ({ page }) => {
    const res = await page.goto('/about')
    expect(res?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    // "How it works" is an eyebrow label (<p>), not a heading — just check text exists
    await expect(page.getByText(/how it works/i).first()).toBeVisible()
  })

  test('/how-it-works redirects to /about', async ({ page }) => {
    await page.goto('/how-it-works')
    await page.waitForURL(/\/about/, { timeout: 8_000 })
    expect(page.url()).toMatch(/\/about/)
  })
})

test.describe('Smoke · B2B / Apartments', () => {
  test('apartments landing loads with hero + partner CTA', async ({ page }) => {
    // /business/apartments redirects to /for-gyms-apartments
    await page.goto('/business/apartments')
    await page.waitForURL(/\/for-gyms-apartments/, { timeout: 8_000 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    // CTA is "Become a Partner Location"
    await expect(
      page.getByRole('link', { name: /become a partner|partner location/i })
        .or(page.getByRole('button', { name: /become a partner|partner location/i }))
        .first()
    ).toBeVisible()
  })

  test('/for-gyms-apartments page loads', async ({ page }) => {
    const res = await page.goto('/for-gyms-apartments')
    expect(res?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})

test.describe('Smoke · Legal pages', () => {
  const legalPages: Array<[string, RegExp]> = [
    ['/terms',   /terms/i],
    ['/privacy', /privacy/i],
    ['/waiver',  /waiver|liability/i],
    ['/safety',  /safety/i],
  ]
  for (const [path, heading] of legalPages) {
    test(`${path} returns 200 and renders its heading`, async ({ page }) => {
      const res = await page.goto(path)
      expect(res?.status(), `${path} status`).toBe(200)
      await expect(page.getByRole('heading', { level: 1 })).toContainText(heading)
    })
  }
})

test.describe('Smoke · Pricing', () => {
  test('/pricing page loads', async ({ page }) => {
    const res = await page.goto('/pricing')
    expect(res?.status()).toBe(200)
    // Page uses h2 (no h1) — just confirm a heading renders
    await expect(page.getByRole('heading').first()).toBeVisible()
  })
})
