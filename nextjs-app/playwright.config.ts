import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.PORT ?? 3000)
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`

// CI runs headless across all 3 viewports; local runs only chromium-desktop by default.
const isCI = !!process.env.CI

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './tests/e2e/.results',
  snapshotDir: './tests/e2e/screenshots/snapshots',
  timeout: 45_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
    },
  },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // Next.js dev server compiles on demand; multiple parallel workers
  // overload it. Stay at 1 locally, bump to 2 on CI where Vercel handles load.
  workers: isCI ? 2 : 1,
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }], ['json', { outputFile: 'tests/e2e/reports/test-results.json' }]]
    : [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'tests/e2e/reports/test-results.json' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  // All 3 projects use Chromium so we don't need to install WebKit/Firefox.
  // Mobile + tablet just emulate viewport + user agent.
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'tablet',
      use: { ...devices['Desktop Chrome'], viewport: { width: 820, height: 1180 }, userAgent: devices['iPad (gen 7)'].userAgent },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] }, // Pixel 5 uses Chromium under the hood
    },
  ],
  // Spin up the dev server automatically when running locally.
  // Skip on CI where you typically point at a deployed preview URL.
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: BASE_URL,
        reuseExistingServer: !isCI,
        timeout: 90_000,
        stdout: 'ignore',
        stderr: 'pipe',
      },
})
