import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Look for test files in the "test" directory, relative to this configuration file.
  testDir: './test',

  // Run all tests in parallel.
  // TODO: Enable later once we have more tests.
  fullyParallel: false,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Workers to run parallel tests with.
  workers: 2,

  // Concise 'dot' for CI, default 'html' when running locally.
  // See https://playwright.dev/docs/test-reporters.
  reporter: process.env.CI ? 'list' : 'html',

  // Shared settings for all the projects below.
  // See https://playwright.dev/docs/api/class-testoptions.
  use: {
    // Collect traces when running locally.
    // See https://playwright.dev/docs/trace-viewer.
    trace: process.env.CI ? 'off' : 'on',
    baseURL: 'http://localhost:9011/'
  },

  // Configure projects for major browsers.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  // Web server configuration.
  webServer: {
    command: 'pnpm run serve:test-dapp',
    url: 'http://127.0.0.1:9011',
    reuseExistingServer: !process.env.CI
  }
})
