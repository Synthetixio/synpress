import { defineConfig } from "cypress";
import { installSynpress } from './src/cypress';

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: "http://localhost:9999",
    supportFile: "src/cypress/support/e2e.{js,jsx,ts,tsx}",
    specPattern: "test/**/*.cy.{js,jsx,ts,tsx}",
    fixturesFolder: "src/cypress/fixtures",
    testIsolation: false,
    async setupNodeEvents(on, config) {
      return installSynpress(on, config);
    },
  },
});
