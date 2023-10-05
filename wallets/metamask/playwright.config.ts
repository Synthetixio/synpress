import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Look for test files in the "tests/e2e" directory, relative to this configuration file.
  testDir: './test/e2e',

  // Run all tests in parallel.
  // TODO: Enable later once we have more tests.
  fullyParallel: false,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  // Concise 'dot' for CI, default 'html' when running locally. See https://playwright.dev/docs/test-reporters.
  reporter: process.env.CI ? 'dot' : 'html',

  // Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions.
  use: {
    // Collect traces for all failed tests. See https://playwright.dev/docs/trace-viewer.
    trace: 'retain-on-failure'
  },

  // Configure projects for major browsers.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
