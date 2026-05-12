// Custom contrast audit — scans visible text elements for white-on-white,
// low contrast, invisible text, and other visual readability issues.
import { test, expect } from '@playwright/test'
import { ROUTES, VIEWPORTS } from './helpers/routes'
import { runContrastAudit, checkHorizontalOverflow } from './helpers/contrast'
import { writeContrastReport } from './helpers/reporters'
import type { ContrastIssue } from './helpers/contrast'

const allIssues: ContrastIssue[] = []

// Test public pages for contrast issues
for (const route of ROUTES.public) {
  test(`contrast audit: ${route.name} (${route.path})`, async ({ page }) => {
    await page.goto(route.path, { timeout: 30_000, waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000) // Let styles settle

    const issues = await runContrastAudit(page)
    allIssues.push(...issues)

    const critical = issues.filter(i => i.severity === 'critical')
    const serious = issues.filter(i => i.severity === 'serious')

    // Take screenshot if issues found
    if (critical.length > 0 || serious.length > 0) {
      const slug = route.path.replace(/\//g, '_') || 'home'
      await page.screenshot({
        path: `tests/e2e/screenshots/contrast-${slug}.png`,
        fullPage: true,
      })
    }

    // Fail on critical issues (white-on-white, dark-on-dark)
    expect(
      critical,
      `Found ${critical.length} CRITICAL contrast issues on ${route.path}:\n` +
        critical.map(i => `  - "${i.textContent.slice(0, 50)}" → ${i.issue}`).join('\n')
    ).toHaveLength(0)
  })
}

// Test responsive contrast at mobile size
test('contrast audit: Homepage at mobile viewport', async ({ page }) => {
  await page.setViewportSize(VIEWPORTS.mobile)
  await page.goto('/', { timeout: 30_000, waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1000)

  const issues = await runContrastAudit(page)
  allIssues.push(...issues)

  const critical = issues.filter(i => i.severity === 'critical')
  if (critical.length > 0) {
    await page.screenshot({
      path: 'tests/e2e/screenshots/contrast-mobile-home.png',
      fullPage: true,
    })
  }

  expect(
    critical,
    `Found ${critical.length} CRITICAL mobile contrast issues`
  ).toHaveLength(0)
})

test('contrast audit: Auth page at mobile viewport', async ({ page }) => {
  await page.setViewportSize(VIEWPORTS.mobile)
  await page.goto('/app/auth', { timeout: 30_000, waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1000)

  const issues = await runContrastAudit(page)
  allIssues.push(...issues)

  const critical = issues.filter(i => i.severity === 'critical')
  expect(
    critical,
    `Found ${critical.length} CRITICAL contrast issues on auth page (mobile)`
  ).toHaveLength(0)
})

// Horizontal overflow tests
for (const route of ROUTES.public) {
  test(`no horizontal overflow: ${route.name} (mobile)`, async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto(route.path, { timeout: 30_000, waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)

    const hasOverflow = await checkHorizontalOverflow(page)
    if (hasOverflow) {
      await page.screenshot({
        path: `tests/e2e/screenshots/overflow-${route.path.replace(/\//g, '_') || 'home'}.png`,
        fullPage: true,
      })
    }
    expect(hasOverflow, `${route.path} has horizontal overflow on mobile`).toBe(false)
  })
}

// Write consolidated report after all tests
test.afterAll(() => {
  if (allIssues.length > 0) {
    writeContrastReport(allIssues as unknown as Array<Record<string, unknown>>)
  }
})
