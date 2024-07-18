import { defineConfig } from 'cypress'
import { configureSynpress } from './src/cypress'

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://localhost:9999',
    specPattern: 'test/cypress/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'src/cypress/support/e2e.{js,jsx,ts,tsx}',
    fixturesFolder: 'src/cypress/fixtures',
    testIsolation: false,
    async setupNodeEvents(on, config) {
      return configureSynpress(on, config)
    }
  }
})
