// Comprehensive accessibility tests using @axe-core/playwright + custom checks.
// Scans every major page for WCAG AA violations, color contrast, missing labels, etc.
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { ROUTES } from './helpers/routes'
import { writeAccessibilityReport } from './helpers/reporters'

interface AxeViolation {
  id: string
  impact: string | null
  description: string
  helpUrl: string
  nodes: Array<{ html: string; target: string[]; failureSummary: string }>
}

const allViolations: Array<Record<string, unknown>> = []

// Axe accessibility scan for each public page
for (const route of ROUTES.public) {
  test(`axe a11y: ${route.name} (${route.path})`, async ({ page }) => {
    await page.goto(route.path, { timeout: 30_000, waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1500)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      // Color contrast is tested separately in contrast-audit.spec.ts with our custom checker
      .disableRules(['color-contrast'])
      .analyze()

    const violations = results.violations as AxeViolation[]

    // Save to report
    for (const v of violations) {
      allViolations.push({
        page: route.path,
        rule: v.id,
        impact: v.impact,
        description: v.description,
        helpUrl: v.helpUrl,
        elements: v.nodes.map(n => ({
          html: n.html.slice(0, 200),
          target: n.target,
          failureSummary: n.failureSummary,
        })),
      })
    }

    // Fail on critical and serious violations
    const criticalAndSerious = violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    )

    if (criticalAndSerious.length > 0) {
      await page.screenshot({
        path: `tests/e2e/screenshots/a11y-${route.path.replace(/\//g, '_') || 'home'}.png`,
        fullPage: true,
      })
    }

    const summary = criticalAndSerious.map(v =>
      `[${v.impact}] ${v.id}: ${v.description}\n` +
      v.nodes.slice(0, 3).map(n => `    → ${n.target.join(' > ')}`).join('\n')
    ).join('\n\n')

    expect(
      criticalAndSerious.length,
      `${route.path} has ${criticalAndSerious.length} critical/serious a11y violations:\n\n${summary}`
    ).toBe(0)
  })
}

// Specifically test color contrast rule
for (const route of ROUTES.public) {
  test(`color-contrast: ${route.name} (${route.path})`, async ({ page }) => {
    await page.goto(route.path, { timeout: 30_000, waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1500)

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze()

    const contrastViolations = results.violations

    if (contrastViolations.length > 0) {
      const nodes = contrastViolations.flatMap(v => v.nodes)
      const summary = nodes.slice(0, 10).map(n =>
        `  "${(n as { html: string }).html.slice(0, 80)}..." → ${(n as { failureSummary: string }).failureSummary?.slice(0, 100)}`
      ).join('\n')

      // Store for report
      allViolations.push({
        page: route.path,
        rule: 'color-contrast',
        impact: 'serious',
        elementCount: nodes.length,
        details: summary,
      })

      // This test reports but doesn't hard-fail, since we have the contrast-audit for that
      console.warn(`⚠️ ${route.path}: ${nodes.length} color contrast issues:\n${summary}`)
    }
  })
}

// Custom checks: buttons without accessible names
for (const route of ROUTES.public) {
  test(`buttons have names: ${route.name}`, async ({ page }) => {
    await page.goto(route.path, { timeout: 30_000, waitUntil: 'domcontentloaded' })

    const violations = await page.evaluate(() => {
      const issues: string[] = []
      document.querySelectorAll('button, a[href]').forEach(el => {
        const htmlEl = el as HTMLElement
        const style = window.getComputedStyle(htmlEl)
        if (style.display === 'none' || style.visibility === 'hidden') return

        const aria = htmlEl.getAttribute('aria-label') ?? ''
        const text = htmlEl.innerText?.trim() ?? ''
        const title = htmlEl.getAttribute('title') ?? ''
        const ariaBy = htmlEl.getAttribute('aria-labelledby') ?? ''
        if (!aria && !text && !title && !ariaBy) {
          issues.push(`<${el.tagName.toLowerCase()}> ${htmlEl.outerHTML.slice(0, 80)}`)
        }
      })
      return issues
    })

    expect(violations, `Unnamed buttons/links:\n${violations.join('\n')}`).toHaveLength(0)
  })
}

// Custom checks: inputs without labels
for (const route of ROUTES.public) {
  test(`inputs have labels: ${route.name}`, async ({ page }) => {
    await page.goto(route.path, { timeout: 30_000, waitUntil: 'domcontentloaded' })

    const unlabeled = await page.evaluate(() => {
      const orphans: string[] = []
      document.querySelectorAll('input, textarea, select').forEach(el => {
        const input = el as HTMLInputElement
        if (input.type === 'hidden') return
        const style = window.getComputedStyle(input)
        if (style.display === 'none') return

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

    expect(unlabeled, `Unlabeled inputs:\n${unlabeled.join('\n')}`).toHaveLength(0)
  })
}

// Keyboard navigation test
test('keyboard nav: splash page CTA reachable via Tab', async ({ page }) => {
  await page.goto('/app', { timeout: 30_000 })
  let focused = ''
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab')
    focused = await page.evaluate(() => document.activeElement?.textContent?.trim() ?? '')
    if (/get started|sign in|i already|log in/i.test(focused)) break
  }
  expect(focused).toMatch(/get started|sign in|i already|log in/i)
})

// Write report after all tests
test.afterAll(() => {
  if (allViolations.length > 0) {
    writeAccessibilityReport(allViolations)
  }
})
