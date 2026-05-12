// Console and network error detection — catches JS errors, failed requests,
// hydration errors, and broken assets on every public page.
import { test, expect } from '@playwright/test'
import { ROUTES } from './helpers/routes'
import { writeErrorReport } from './helpers/reporters'

interface PageError {
  page: string
  type: 'console-error' | 'network-error' | 'js-exception'
  message: string
  url?: string
  status?: number
}

const allErrors: PageError[] = []

for (const route of ROUTES.public) {
  test(`no critical errors: ${route.name} (${route.path})`, async ({ page }) => {
    const errors: PageError[] = []

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text()
        // Ignore known non-critical warnings
        if (text.includes('Download the React DevTools')) return
        if (text.includes('Third-party cookie')) return
        if (text.includes('favicon.ico')) return

        errors.push({
          page: route.path,
          type: 'console-error',
          message: text.slice(0, 500),
        })
      }
    })

    // Listen for unhandled exceptions
    page.on('pageerror', error => {
      errors.push({
        page: route.path,
        type: 'js-exception',
        message: error.message.slice(0, 500),
      })
    })

    // Listen for failed network requests
    page.on('response', response => {
      const status = response.status()
      const url = response.url()
      // Skip external analytics/tracking failures
      if (url.includes('google') || url.includes('analytics') || url.includes('facebook')) return
      if (url.includes('favicon.ico')) return

      if (status >= 400) {
        errors.push({
          page: route.path,
          type: 'network-error',
          message: `HTTP ${status}`,
          url: url.slice(0, 200),
          status,
        })
      }
    })

    await page.goto(route.path, { timeout: 30_000, waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2000)

    allErrors.push(...errors)

    // Filter to truly critical errors (not 404s for optional assets)
    const critical = errors.filter(e => {
      if (e.type === 'js-exception') return true
      if (e.type === 'console-error' && (
        e.message.includes('hydration') ||
        e.message.includes('Uncaught') ||
        e.message.includes('TypeError') ||
        e.message.includes('ReferenceError')
      )) return true
      if (e.type === 'network-error' && e.status && e.status >= 500) return true
      return false
    })

    const summary = critical.map(e =>
      `[${e.type}] ${e.message}${e.url ? ` (${e.url})` : ''}`
    ).join('\n')

    expect(
      critical.length,
      `${route.path} has ${critical.length} critical errors:\n${summary}`
    ).toBe(0)
  })
}

// Write error report after all tests
test.afterAll(() => {
  if (allErrors.length > 0) {
    writeErrorReport(allErrors as unknown as Array<Record<string, unknown>>)
  }
})
