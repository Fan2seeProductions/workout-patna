// Lightweight a11y: every focusable button/link should have an accessible name,
// every input should have an associated label, the splash CTA should be reachable
// via keyboard.
import { test, expect } from '@playwright/test'

const ROUTES = ['/app', '/app/auth', '/business/apartments', '/terms', '/privacy', '/waiver']

for (const route of ROUTES) {
  test.describe(`a11y · ${route}`, () => {
    test('every button + link has an accessible name', async ({ page }) => {
      await page.goto(route)
      const violations = await page.evaluate(() => {
        const issues: string[] = []
        const els = document.querySelectorAll('button, a[href]')
        els.forEach(el => {
          const aria = (el as HTMLElement).getAttribute('aria-label') ?? ''
          const text = (el as HTMLElement).innerText?.trim() ?? ''
          const title = (el as HTMLElement).getAttribute('title') ?? ''
          if (!aria && !text && !title) {
            issues.push(`<${el.tagName.toLowerCase()}> at ${el.outerHTML.slice(0, 80)}…`)
          }
        })
        return issues
      })
      expect(violations, violations.join('\n')).toHaveLength(0)
    })

    test('every visible input has an associated label', async ({ page }) => {
      await page.goto(route)
      const unlabeled = await page.evaluate(() => {
        const orphans: string[] = []
        document.querySelectorAll('input, textarea, select').forEach(el => {
          const input = el as HTMLInputElement
          if (input.type === 'hidden') return
          const id = input.id
          const aria = input.getAttribute('aria-label')
          const ariaby = input.getAttribute('aria-labelledby')
          const placeholder = input.placeholder
          const wrappingLabel = input.closest('label')
          const labelFor = id ? document.querySelector(`label[for="${id}"]`) : null
          if (!aria && !ariaby && !wrappingLabel && !labelFor && !placeholder) {
            orphans.push(input.outerHTML.slice(0, 100))
          }
        })
        return orphans
      })
      expect(unlabeled, unlabeled.join('\n')).toHaveLength(0)
    })
  })
}

test.describe('keyboard navigation', () => {
  test('splash → reachable CTA via Tab key', async ({ page }) => {
    await page.goto('/app')
    // Press Tab a handful of times and confirm we eventually focus a CTA-style element
    let focused = ''
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab')
      focused = await page.evaluate(() => document.activeElement?.textContent?.trim() ?? '')
      if (/get started|sign in|i already/i.test(focused)) break
    }
    expect(focused, `focused element after Tab cycles: "${focused}"`).toMatch(/get started|sign in|i already/i)
  })
})
