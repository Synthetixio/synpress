# Quick Setup: Playwright with Synpress

This guide provides a quick setup process for Playwright with Synpress to automate tests for Web3 dapps. Note that this is a basic configuration, and Synpress offers many more advanced functions and features for comprehensive testing.

## Prerequisites

- Node.js v18+
- Playwright and TypeScript knowledge

## Installation

1. Install Playwright and its dependencies:

   ```bash
   npm init playwright@latest
   ```

   Follow the prompts to complete the installation.

2. Install Synpress as a dev dependency:

   ```bash
   npm install --save-dev @synthetixio/synpress
   ```

## Setup

1. Create or update your Playwright configuration file (e.g., `playwright.config.ts`):

   ```typescript
   // Import necessary Playwright and Synpress modules
   import { defineConfig, devices } from '@playwright/test';
   import { synpressFixtures } from '@synthetixio/synpress/synpress';

   // Define Playwright configuration
   export default defineConfig({
     testDir: './tests',
     fullyParallel: true,
     forbidOnly: !!process.env.CI,
     retries: process.env.CI ? 2 : 0,
     workers: process.env.CI ? 1 : undefined,
     reporter: 'html',
     use: {
       // Set base URL for tests
       baseURL: 'http://localhost:3000',
       trace: 'on-first-retry',
     },
     projects: [
       {
         name: 'chromium',
         use: { ...devices['Desktop Chrome'] },
       },
     ],
     // Additional Synpress-specific configuration can be added here
   });
   ```

2. Create a `BasicSetup` file (e.g., `wallet-setup/basic.setup.ts`):

   ```typescript
   import { defineWalletSetup } from '@synthetixio/synpress-cache'
   import { MetaMask } from '@synthetixio/synpress'

   // Define a test seed phrase and password
   export const SEED_PHRASE = 'test test test test test test test test test test test junk'
   export const PASSWORD = 'Tester@1234'

   // Define the basic wallet setup
   export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
     // Create a new MetaMask instance
     const metamask = new MetaMask(context, walletPage, PASSWORD)

     // Import the wallet using the seed phrase
     await metamask.importWallet(SEED_PHRASE)
     
     // Additional setup steps can be added here, such as:
     // - Adding custom networks
     // - Importing tokens
     // - Setting up specific account states
   })
   ```

3. Create a simple test file (e.g., `tests/example.spec.ts`):

   ```typescript
   // Import necessary Synpress modules and setup
   import { testWithSynpress, MetaMask, unlockForFixture } from '@synthetixio/synpress'
   import BasicSetup from '../wallet-setup/basic.setup'

   // Create a test instance with Synpress and BasicSetup
   const test = testWithSynpress(BasicSetup, unlockForFixture)

   // Extract expect function from test
   const { expect } = test

   // Define a basic test case
   test('should connect wallet to the MetaMask Test Dapp', async ({ context, page, extensionId }) => {
     // Create a new MetaMask instance
     const metamask = new MetaMask(context, page, BasicSetup.walletPassword, extensionId)

     // Navigate to the homepage
     await page.goto('/')

     // Click the connect button
     await page.locator('#connectButton').click()

     // Connect MetaMask to the dapp
     await metamask.connectToDapp()

     // Verify the connected account address
     await expect(page.locator('#accounts')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')

     // Additional test steps can be added here, such as:
     // - Sending transactions
     // - Interacting with smart contracts
     // - Testing dapp-specific functionality
   })
   ```

## Running Tests

To run your Playwright tests with Synpress:

1. Start your local development server (if testing against a local app).

2. Run the tests:

   ```bash
   npx playwright test
   ```

This will execute your tests using Playwright with Synpress integration.

## Next Steps

- Check the [API documentation](/api/) for detailed Synpress functionalities.
- Explore example projects in the [Synpress GitHub repository](https://github.com/Synthetixio/synpress/tree/new-dawn/examples).
- Join our [Discord community](https://discord.gg/XhZKSRGtWc) for support and best practices.
