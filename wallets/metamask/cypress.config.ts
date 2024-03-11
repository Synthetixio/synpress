import { defineConfig } from 'cypress'
import { prepareExtension } from './src/prepareExtension'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:9999',
    supportFile: 'src/support/e2e.{js,jsx,ts,tsx}',
    specPattern: 'test/**/*.cy.{js,jsx,ts,tsx}',
    fixturesFolder: 'src/fixture-actions',
    testIsolation: false,
    setupNodeEvents(on, config) {
      const browsers = config.browsers.filter((b) => b.name === 'chrome')
      if (browsers.length === 0) {
        throw new Error('No Chrome browser found in the configuration')
      }

      on('before:browser:launch', async (browser, launchOptions) => {
        const metamasExtensionPath = await prepareExtension()
        launchOptions.extensions.push(metamasExtensionPath)

        return launchOptions
      })

      return {
        ...config,
        browsers
      }
    }
  }
})
