import { defineConfig } from 'cypress'
import { installSynpress } from './src/cypress'

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://localhost:9999',
    specPattern: 'test/cypress/mock/mockEthereum.cy.ts',
    supportFile: 'src/cypress/support/e2e.{js,jsx,ts,tsx}',
    fixturesFolder: 'src/cypress/fixtures',
    testIsolation: false,
    async setupNodeEvents(on, config) {
      return installSynpress(on, config)
    }
  }
})
