import { test, expect } from '@playwright/test'

// Only run this file on mobile + tablet projects
test.beforeEach(async ({}, testInfo) => {
  test.skip(testInfo.project.name === 'desktop', 'Mobile-only suite')
})

test.describe('Mobile responsiveness', () => {
  test('splash has no horizontal overflow and CTA is tappable', async ({ page }) => {
    await page.goto('/app')
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    // Allow a 1px tolerance for sub-pixel rounding
    expect(scrollWidth - clientWidth).toBeLessThanOrEqual(1)
    await expect(page.getByRole('link', { name: /get started/i }).first()).toBeVisible()
  })

  test('apartments landing has no horizontal overflow on mobile', async ({ page }) => {
    await page.goto('/business/apartments')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(1)
  })

  test('auth form fields are reachable and tappable on mobile', async ({ page }) => {
    await page.goto('/app/auth')
    const email = page.getByLabel(/email/i)
    await email.scrollIntoViewIfNeeded()
    await email.fill('mobile@test.com')
    await expect(email).toHaveValue('mobile@test.com')
  })
})
