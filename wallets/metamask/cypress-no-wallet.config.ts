import { defineConfig } from 'cypress'
import configureSynpress from './src/cypress/configureSynpress'

export default defineConfig({
  userAgent: 'synpress',
  chromeWebSecurity: true,
  e2e: {
    baseUrl: 'http://localhost:9999',
    specPattern: 'test/cypress/**/importWallet.cy.no-wallet.{js,jsx,ts,tsx}',
    supportFile: 'src/cypress/support/e2e.{js,jsx,ts,tsx}',
    testIsolation: false,
    async setupNodeEvents(on, config) {
      return configureSynpress(on, config, false)
    }
  }
})
