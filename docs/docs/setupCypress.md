# Quick Setup: Cypress with Synpress

This guide provides a streamlined setup process for integrating Cypress with Synpress to automate tests for Web3 dapps. While this covers the basic configuration, Synpress offers a wide range of advanced features for comprehensive testing.

## Prerequisites

- Node.js v18+
- Basic knowledge of Cypress and TypeScript

## Installation

Install Cypress and Synpress in your project:

```bash
npm install --save-dev cypress @synthetixio/synpress@latest
```

## Setup

1. Create a Cypress configuration file (`cypress.config.ts`) in your project root:

   ```typescript
   import { configureSynpressForMetaMask } from "@synthetixio/synpress/cypress";
   import { defineConfig } from "cypress";

   export default defineConfig({
     chromeWebSecurity: false,
     e2e: {
       baseUrl: "http://localhost:9999",
       specPattern: "test/cypress/**/*.cy.{js,jsx,ts,tsx}",
       supportFile: "src/cypress/support/e2e.{js,jsx,ts,tsx}",
       testIsolation: false,
       async setupNodeEvents(on, config) {
         return configureSynpressForMetaMask(on, config);
       },
     },
   });
   ```

2. Create a support file (`src/cypress/support/e2e.ts`) and import Synpress commands:

   ```typescript
   import { synpressCommandsForMetaMask } from "@synthetixio/synpress/cypress/support";

   Cypress.on("uncaught:exception", () => {
     // failing the test
     return false;
   });

   synpressCommandsForMetaMask();

   before(() => {
     cy.visit("/");
   });
   ```

3. Update your `tsconfig.json` to include Cypress types:

   ```json
   {
     "compilerOptions": {
       "types": ["cypress"],
       "esModuleInterop": true
     },
     "include": ["cypress.config.ts", "test", "src"],
     "files": ["environment.d.ts"]
   }
   ```

## Writing Tests

Here's an optimized example of how to write tests using Cypress with Synpress integration:

1. Create a new test file (e.g., `test/cypress/e2e/metamask.cy.ts`):

   ```typescript
   describe('MetaMask', () => {
     it('should connect wallet and display account information', () => {
       // Click the connect button to initiate wallet connection
       cy.get('#connectButton').click()

       // Use Synpress command to connect MetaMask to the dApp
       cy.connectToDapp()

       // Verify that the connected account address is displayed correctly
       cy.get('#accounts').should(
         'have.text',
         '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
       )

       // Additional test steps can be added here, such as:
       // - Sending transactions
       // - Interacting with smart contracts
       // - Testing dapp-specific functionality
     })
   ```

## Running Tests

To run your Cypress tests with Synpress:

1. Ensure your local development server is running (if testing against a local app).

2. Run the tests using the following command:

   ```bash
   npx cypress run --browser chrome --headed
   ```

This will execute your tests using Cypress with Synpress integration in headless mode.

## Next Steps

- Dive deeper into Synpress capabilities:

  - Study the [Synpress API documentation](/api/) for comprehensive command and utility details.
  - Explore advanced features like custom network management, gas fee optimization, and event listeners.

- Enhance your test suite:
  - Implement complex scenarios such as token transfers, smart contract interactions, and multi-step dApp workflows.
  - Simulate various network conditions to ensure robust dApp performance.
  - Utilize Synpress's built-in commands for MetaMask interactions and blockchain operations.
