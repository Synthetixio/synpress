import { configureSynpressForEthereumWalletMock } from '@synthetixio/synpress/cypress'
import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://localhost:9999',
    specPattern: 'test/cypress/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'src/cypress/support/e2e.{js,jsx,ts,tsx}',
    testIsolation: false,
    async setupNodeEvents(on, config) {
      return configureSynpressForEthereumWalletMock(on, config)
    }
  }
})
