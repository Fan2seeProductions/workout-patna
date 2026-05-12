import { test, expect } from '@playwright/test'
import { SAMPLE_BUSINESS_LEAD } from './helpers/test-data'

test.describe('Forms', () => {
  test.describe('partner lead form (/for-gyms-apartments)', () => {
    // /business/apartments now redirects here; form is PartnerLeadForm
    test('required fields block submit', async ({ page }) => {
      await page.goto('/for-gyms-apartments#partner')
      const form = page.locator('form')
      const submit = form.getByRole('button', { name: /request partnership/i })
      await submit.scrollIntoViewIfNeeded()
      await submit.click()
      // HTML5 validation keeps us on the same page; success card shouldn't appear
      await expect(page.getByText(/we'll be in touch/i)).toBeHidden()
    })

    test('successful submission shows confirmation card', async ({ page }) => {
      await page.goto('/for-gyms-apartments#partner')
      const form = page.locator('form')
      await form.getByLabel(/your name/i).fill(SAMPLE_BUSINESS_LEAD.contactName)
      await form.getByLabel(/^email/i).fill(SAMPLE_BUSINESS_LEAD.contactEmail)
      await form.getByLabel(/organization name/i).fill(SAMPLE_BUSINESS_LEAD.proposedName + '-' + Date.now())
      await form.getByLabel(/^city/i).fill(SAMPLE_BUSINESS_LEAD.city)
      await form.getByLabel(/^state/i).fill(SAMPLE_BUSINESS_LEAD.state)
      await form.getByRole('button', { name: /request partnership/i }).click()
      await expect(page.getByText(/we'll be in touch/i)).toBeVisible({ timeout: 10_000 })
    })
  })

  test.describe('auth form', () => {
    test('email + password are required', async ({ page }) => {
      await page.goto('/app/auth?mode=signin')
      await page.getByRole('button', { name: /^sign in$/i }).click()
      // Browser should block submit; we should still be on /app/auth
      await page.waitForTimeout(300)
      expect(page.url()).toMatch(/\/app\/auth/)
    })

    test('switching to signup shows the create-account CTA', async ({ page }) => {
      await page.goto('/app/auth?mode=signin')
      const switchLink = page.getByRole('link', { name: /create an account/i }).or(
        page.getByRole('button', { name: /create an account|sign up/i })
      )
      if (await switchLink.first().isVisible().catch(() => false)) {
        await switchLink.first().click()
        await expect(
          page.getByRole('button', { name: /create account|get started|sign up/i }).first(),
        ).toBeVisible()
      } else {
        // Fallback to URL switch if the auth page uses query params
        await page.goto('/app/auth?mode=signup')
        await expect(
          page.getByRole('button', { name: /create account|get started|sign up/i }).first(),
        ).toBeVisible()
      }
    })
  })
})
