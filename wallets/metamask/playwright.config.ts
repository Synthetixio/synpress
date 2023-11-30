import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Look for test files in the "test/e2e" directory, relative to this configuration file.
  testDir: './test/e2e',

  // We're increasing the timeout to 60 seconds to allow all traces to be recorded.
  // Sometimes it threw an error saying that traces were not recorded in the 30 seconds timeout limit.
  timeout: 60_000,

  // Run all tests in parallel.
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Opt out of parallel tests on CI since it supports only 1 worker.
  workers: process.env.CI ? 1 : undefined,

  // Concise 'dot' for CI, default 'html' when running locally.
  // See https://playwright.dev/docs/test-reporters.
  reporter: process.env.CI
    ? [['html', { open: 'never', outputFolder: `playwright-report-${process.env.HEADLESS ? 'headless' : 'headful'}` }]]
    : 'html',

  // Shared settings for all the projects below.
  // See https://playwright.dev/docs/api/class-testoptions.
  use: {
    // We are using locally deployed MetaMask Test Dapp.
    baseURL: 'http://localhost:9999',

    // Collect all traces on CI, and only traces for failed tests when running locally.
    // See https://playwright.dev/docs/trace-viewer.
    trace: process.env.CI ? 'on' : 'retain-on-failure'
  },

  // Configure projects for major browsers.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
