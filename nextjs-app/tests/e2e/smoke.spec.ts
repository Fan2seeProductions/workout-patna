// Smoke tests. Public routes should all load without console errors,
// without blank screens, and with their key CTA visible.
import { test, expect } from '@playwright/test'

test.describe('Smoke', () => {
  test('apex / redirects to /app splash', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL('**/app')
    await expect(page).toHaveURL(/\/app$/)
  })

  test('splash renders with primary CTAs', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', msg => msg.type() === 'error' && errors.push(msg.text()))

    await page.goto('/app')

    // The screen should not be blank
    const body = await page.locator('body').textContent()
    expect((body ?? '').trim().length).toBeGreaterThan(20)

    // At least one auth CTA should be reachable from the splash
    const hasGetStarted = await page.getByRole('link', { name: /get started/i }).first().isVisible().catch(() => false)
    const hasSignIn = await page.getByRole('link', { name: /sign in|i already have/i }).first().isVisible().catch(() => false)
    expect(hasGetStarted || hasSignIn).toBe(true)

    // Filter known harmless noise (Next.js favicon swap, font preconnect)
    const real = errors.filter(e =>
      !/favicon/i.test(e) &&
      !/Failed to load resource/i.test(e) &&
      !/google-fonts/i.test(e),
    )
    expect(real, `console errors: ${real.join('\n')}`).toHaveLength(0)
  })

  test('apartments landing loads with hero + claim CTA', async ({ page }) => {
    await page.goto('/business/apartments')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: /claim your property/i }).first()).toBeVisible()
  })

  test('legal pages return 200 and render their headings', async ({ page }) => {
    for (const [path, heading] of [
      ['/terms',   /terms/i],
      ['/privacy', /privacy/i],
      ['/waiver',  /waiver|liability/i],
    ] as const) {
      const res = await page.goto(path)
      expect(res?.status(), `${path} status`).toBe(200)
      await expect(page.getByRole('heading', { level: 1 })).toContainText(heading)
    }
  })
})
