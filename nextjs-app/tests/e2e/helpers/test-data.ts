// Shared test fixtures + env-driven credentials.

export const PUBLIC_ROUTES = [
  '/',
  '/app',
  '/app/auth',
  '/business/apartments',
  '/terms',
  '/privacy',
  '/waiver',
] as const

export const PROTECTED_ROUTES = [
  '/app/home',
  '/app/browse',
  '/app/discover',
  '/app/messages',
  '/app/profile',
  '/app/challenges',
  '/app/gyms',
  '/app/workouts',
  '/app/merch',
  '/app/notifications',
  '/app/onboarding',
  '/app/coach',
] as const

// Pulled from .env / CI secrets. When unset, auth-dependent tests skip.
export const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL ?? ''
export const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD ?? ''

export const hasTestUser = () =>
  TEST_USER_EMAIL.length > 0 && TEST_USER_PASSWORD.length > 0

// Generate a fresh email for create-account tests so we don't collide.
export function ephemeralEmail() {
  const stamp = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 6)
  return `e2e+${stamp}${rand}@workoutpartna.test`
}

export const SAMPLE_BUSINESS_LEAD = {
  proposedName: 'E2E Test Apartments',
  contactName: 'QA Bot',
  contactRole: 'Property Manager',
  contactEmail: 'e2e-leads@workoutpartna.test',
  contactPhone: '(555) 555-0123',
  city: 'Cypress',
  state: 'TX',
  message: 'Submitted by automated test suite. Safe to ignore.',
}
