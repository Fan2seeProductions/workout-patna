// Visual regression tests — captures screenshots at multiple viewports
// for baseline comparison. Run with --update-snapshots to create baselines.
import { test, expect } from '@playwright/test'
import { ROUTES, VIEWPORTS, type ViewportName } from './helpers/routes'

const viewportEntries = Object.entries(VIEWPORTS) as [ViewportName, { width: number; height: number }][]

// Public pages — screenshot at every viewport
for (const route of ROUTES.public) {
  for (const [vpName, vpSize] of viewportEntries) {
    test(`visual: ${route.name} @ ${vpName} (${vpSize.width}x${vpSize.height})`, async ({ page }) => {
      await page.setViewportSize(vpSize)
      await page.goto(route.path, { timeout: 30_000, waitUntil: 'domcontentloaded' })
      // Wait for images and fonts to load
      await page.waitForTimeout(2000)

      const slug = route.path.replace(/\//g, '_') || 'home'
      await expect(page).toHaveScreenshot(`${slug}-${vpName}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.05, // Allow 5% pixel diff for minor rendering differences
        timeout: 10_000,
      })
    })
  }
}

// Auth page in signup mode
for (const [vpName, vpSize] of viewportEntries) {
  test(`visual: Auth (signup) @ ${vpName}`, async ({ page }) => {
    await page.setViewportSize(vpSize)
    await page.goto('/app/auth?mode=signup', { timeout: 30_000, waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1500)

    await expect(page).toHaveScreenshot(`auth-signup-${vpName}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
      timeout: 10_000,
    })
  })
}
