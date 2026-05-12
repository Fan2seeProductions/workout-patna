// Responsive layout tests — checks for overflow, hidden elements,
// blank pages, and broken layouts at various viewport sizes.
import { test, expect } from '@playwright/test'
import { ROUTES, VIEWPORTS } from './helpers/routes'
import { checkHorizontalOverflow, checkElementVisibility } from './helpers/contrast'

// Check that pages render actual content (not blank)
for (const route of ROUTES.public) {
  test(`not blank: ${route.name} has visible content`, async ({ page }) => {
    await page.goto(route.path, { timeout: 30_000, waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)

    // Page should have non-zero content height
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight)
    expect(bodyHeight, `${route.path} rendered with zero height`).toBeGreaterThan(100)

    // Should have at least one heading or main text block
    const hasContent = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3')
      const paragraphs = document.querySelectorAll('p')
      return headings.length > 0 || paragraphs.length > 0
    })
    expect(hasContent, `${route.path} has no visible headings or paragraphs`).toBe(true)
  })
}

// Mobile layout checks
for (const route of ROUTES.public) {
  test(`mobile layout: ${route.name} no horizontal scroll`, async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto(route.path, { timeout: 30_000, waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)

    const overflow = await checkHorizontalOverflow(page)
    expect(overflow, `${route.path} has horizontal overflow at mobile width`).toBe(false)
  })

  test(`tablet layout: ${route.name} no horizontal scroll`, async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.tablet)
    await page.goto(route.path, { timeout: 30_000, waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)

    const overflow = await checkHorizontalOverflow(page)
    expect(overflow, `${route.path} has horizontal overflow at tablet width`).toBe(false)
  })
}

// Homepage should have clickable CTA buttons
test('homepage: CTA buttons are visible and clickable', async ({ page }) => {
  await page.goto('/', { timeout: 30_000, waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1000)

  // Check that at least one CTA link/button is visible
  const ctaVisible = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*="/app"], button')
    for (const link of links) {
      const rect = (link as HTMLElement).getBoundingClientRect()
      const style = window.getComputedStyle(link as HTMLElement)
      if (rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden') {
        return true
      }
    }
    return false
  })
  expect(ctaVisible, 'Homepage has no visible CTA buttons/links').toBe(true)
})

// Auth page: form inputs are visible
test('auth page: form inputs are visible and interactable', async ({ page }) => {
  await page.goto('/app/auth', { timeout: 30_000, waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1500)

  // The auth form has labeled inputs
  const emailInput = page.getByLabel(/email/i)
  await expect(emailInput).toBeVisible({ timeout: 5000 })

  const passwordInput = page.getByLabel(/password/i)
  await expect(passwordInput).toBeVisible({ timeout: 5000 })

  const submitButton = page.getByRole('button', { name: 'Sign In', exact: true })
  await expect(submitButton).toBeVisible({ timeout: 5000 })
  await expect(submitButton).toBeEnabled()
})

// Mobile nav test
test('mobile: navigation is accessible', async ({ page }) => {
  await page.setViewportSize(VIEWPORTS.mobile)
  await page.goto('/', { timeout: 30_000, waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1000)

  // Either a hamburger menu exists or nav links are visible
  const hasNav = await page.evaluate(() => {
    // Check for mobile menu button
    const menuBtn = document.querySelector('[aria-label*="menu" i], button[class*="menu" i], [data-testid*="menu" i]')
    if (menuBtn) return true
    // Check for visible nav links
    const navLinks = document.querySelectorAll('nav a, header a')
    for (const link of navLinks) {
      const rect = (link as HTMLElement).getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) return true
    }
    return false
  })
  expect(hasNav, 'No navigation accessible on mobile').toBe(true)
})

// Text overlap detection
for (const route of ROUTES.public.slice(0, 4)) {
  test(`no text overlap: ${route.name} at mobile`, async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto(route.path, { timeout: 30_000, waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)

    // Check that no visible text elements overlap significantly
    const overlaps = await page.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, h3, p, a, button, span')
      const rects: { el: string; rect: DOMRect }[] = []
      for (const el of elements) {
        const style = window.getComputedStyle(el as HTMLElement)
        if (style.display === 'none' || style.visibility === 'hidden') continue
        const rect = (el as HTMLElement).getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          rects.push({ el: (el as HTMLElement).textContent?.slice(0, 30) || el.tagName, rect })
        }
      }

      let overlapCount = 0
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i].rect
          const b = rects[j].rect
          // Check significant overlap (more than 50% of the smaller element)
          const overlapX = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
          const overlapY = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
          const overlapArea = overlapX * overlapY
          const smallerArea = Math.min(a.width * a.height, b.width * b.height)
          if (smallerArea > 0 && overlapArea / smallerArea > 0.5) {
            overlapCount++
          }
        }
        if (overlapCount > 5) break // Don't over-scan
      }
      return overlapCount
    })

    // Allow some overlaps (navbars, badges, stacked cards), but flag if excessive
    expect(overlaps, `${route.path} has ${overlaps} significantly overlapping text elements`).toBeLessThan(10)
  })
}
