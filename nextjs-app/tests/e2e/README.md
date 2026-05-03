# End-to-end tests

Playwright covers the public + auth-gated routes, the apartment lead form,
core auth flow, mobile responsiveness, API behavior, and basic a11y.

## Run

```bash
# all suites, all viewports (desktop + tablet + mobile)
npm run test:e2e

# interactive UI mode
npm run test:e2e:ui

# headed (see the browser) on desktop only
npm run test:e2e:headed

# step-through debugger
npm run test:e2e:debug

# open last HTML report
npm run test:e2e:report
```

The dev server boots automatically on first run via `webServer` in
`playwright.config.ts`. Set `PLAYWRIGHT_BASE_URL` to point at a deployed
preview (e.g. `https://workoutpartna.com`) instead.

## Environment variables

```bash
# .env.local  (or CI secrets)
TEST_USER_EMAIL=         # seeded test user, enables auth + dashboard suites
TEST_USER_PASSWORD=      # ↑
E2E_ALLOW_SIGNUP=        # set to "1" to allow signup tests to actually create accounts
PLAYWRIGHT_BASE_URL=     # override the local-dev URL
```

Without `TEST_USER_EMAIL` + `TEST_USER_PASSWORD`, the dashboard and
"valid sign-in" tests skip (not fail). Set them in `.env.local` (which is
gitignored) or in your CI secret store before running the full suite.

## Debug a failing test

1. `npm run test:e2e:debug` opens the Playwright inspector.
2. Failing runs leave a video, screenshot, and trace in
   `tests/e2e/.results/`.
3. Open the HTML report: `npm run test:e2e:report`.
4. Open a single trace: `npx playwright show-trace tests/e2e/.results/<test>/trace.zip`.

## Adding a new test

- Drop a `*.spec.ts` file in `tests/e2e/`.
- Prefer accessible-name selectors: `page.getByRole`, `page.getByLabel`,
  `page.getByText` over `data-testid`.
- Use `tests/e2e/helpers/auth.ts` to sign in.
- Use `tests/e2e/helpers/test-data.ts` for shared fixtures.
