import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Look for test files in the "test/e2e" directory, relative to this configuration file.
  testDir: './test/playwright',

  // Run all tests in parallel.
  fullyParallel: true,

  // Use half of the number of logical CPU cores for running tests in parallel.
  workers: undefined,

  use: {
    // We are using locally deployed MetaMask Test Dapp.
    baseURL: 'http://localhost:9999'
  },

  // Synpress currently only supports Chromium, however, this will change in the future.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  // Serve MetaMask Test Dapp locally before starting the tests.
  webServer: {
    command: 'pnpm run serve:test-dapp',
    url: 'http://localhost:9999',
    reuseExistingServer: true
  }
})
