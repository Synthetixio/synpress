# Migration Guide: Synpress v3 to v4

Synpress v4 introduces significant improvements in functionality, performance, and API design. This guide will help you seamlessly transition your tests from v3 to v4.


::: warning
This migration guide is particularly for Cypress users. If you're using Playwright with Synpress, please refer to the [Playwright-specific documentation](/docs/setupPlaywright).
:::



## Key Changes Overview

1. **Installation**: Unchanged
2. **Configuration**: New MetaMask-specific setup
3. **Support Files**: More granular command imports
4. **TypeScript Configuration**: Written in TypeScript to improve compatibility and readability
5. **Test Structure**: Simplified with automatic page visits
6. **MetaMask Interactions**: Renamed and enhanced commands
7. **Test Execution**: Standardized Cypress command
8. **Configuration Options**: Expanded for greater flexibility

## Key Changes

1. **Installation**:

   ```bash
   npm install @synthetixio/synpress@latest
   ```

   The installation process remains the same in v4.

2. **Configuration**:

   - Update your `cypress.config.ts`:

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

   The v4 configuration uses `configureSynpressForMetaMask` instead of the previous `cypressGrepPlugin`. This new function handles MetaMask-specific setup automatically.

3. **Support Files**:

   - Create or update `src/cypress/support/e2e.ts`:

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

   In v4, you import `synpressCommandsForMetaMask` instead of the previous global import. This allows for more granular control over which commands are available in your tests.

4. **TypeScript Configuration**:

   - Update your `tsconfig.json`:

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

   The v4 TypeScript configuration is more streamlined, focusing on Cypress types and ensuring compatibility with ES modules.

5. **Test Structure**:

   - v4 no longer requires explicit `cy.visit()` calls in tests or `before()` hooks
   - The initial page visit is now handled by the configuration step

   This change simplifies test structure and further improves performance by eliminating redundant page loads.

   Example:

   ```typescript
   describe("My Test Suite", () => {
     it("Test 1", () => {
       // Test logic here
     });

     it("Test 2", () => {
       // Test logic here
     });
   });
   ```

   This approach is correct and aligns with Cypress best practices for optimizing test performance.

6. **MetaMask Interactions**:

   - Many MetaMask-specific commands have been renamed or modified for clarity and ease of use
   - Examples of API changes:
     ```typescript
     // v3                                 // v4
     cy.acceptMetamaskAccess()          -> cy.connectToDapp()
     cy.confirmMetamaskTransaction()    -> cy.confirmTransaction()
     cy.rejectMetamaskTransaction()     -> cy.rejectTransaction()
     cy.switchMetamaskNetwork()         -> cy.switchNetwork()
     cy.addMetamaskNetwork()            -> cy.addNetwork()
     cy.importMetamaskAccount()         -> cy.importWallet()
     cy.createMetamaskAccount()         -> // No direct equivalent in v4
     cy.getMetamaskWalletAddress()      -> cy.getAccount()
     cy.switchMetamaskAccount()         -> cy.switchAccount()
     cy.getMetamaskBalance()            -> // No direct equivalent in v4
     ```

   Note: This list may not be exhaustive. It's recommended to check the latest Synpress v4 documentation for a complete list of API changes and new commands that may have been introduced.

7. **Test Execution**:

   - v3: Multiple commands to run tests
   - v4: Simplified to use standard Cypress command:
     ```
     npx cypress run --browser chrome --headed
     ```

8. **Configuration**:
   - v4: May introduce new configuration options for Synpress and MetaMask setup

## Detailed API Changes

Here's a more detailed breakdown of the API changes between Synpress v3 and v4:

1. **Connecting to dApps**:
   - v3: `cy.acceptMetamaskAccess()`
   - v4: `cy.connectToDapp()`

   This change simplifies the command name while maintaining its core functionality.

2. **Transaction Handling**:
   - v3: 
     - `cy.confirmMetamaskTransaction()`
     - `cy.rejectMetamaskTransaction()`
   - v4: 
     - `cy.confirmTransaction()`
     - `cy.rejectTransaction()`

   The new commands are more concise and remove the "Metamask" prefix for clarity.

3. **Network Management**:
   - v3:
     - `cy.switchMetamaskNetwork()`
     - `cy.addMetamaskNetwork()`
   - v4:
     - `cy.switchNetwork()`
     - `cy.addNetwork()`

   These changes streamline network-related commands by removing the "Metamask" prefix.

4. **Wallet Management**:
   - v3:
     - `cy.importMetamaskAccount()`
     - `cy.createMetamaskAccount()`
     - `cy.switchMetamaskAccount()`
   - v4:
     - `cy.importWallet()`
     - No direct equivalent for `createMetamaskAccount()`
     - `cy.switchAccount()`

   The v4 API simplifies wallet management commands and removes the ability to create new accounts directly.

5. **Account Information**:
   - v3:
     - `cy.getMetamaskWalletAddress()`
     - `cy.getMetamaskBalance()`
   - v4:
     - `cy.getAccount()`
     - No direct equivalent for `getMetamaskBalance()`

   The v4 API simplifies getting account information but removes the direct balance checking capability.

6. **New Commands in v4**:
   - `cy.emptyAnvilNode()`: Empties the Anvil node
   - `cy.addNetwork()`: Adds a new network to MetaMask
   - `cy.approveNewNetwork()`: Approves a new network in MetaMask
   - `cy.approveSwitchNetwork()`: Approves switching to a different network in MetaMask
   - `cy.rejectNewNetwork()`: Rejects a new network in MetaMask
   - `cy.rejectSwitchNetwork()`: Rejects switching to a different network in MetaMask
   - `cy.deployToken()`: Deploys a new token contract
   - `cy.addNewToken()`: Adds a new token to MetaMask
   - `cy.approveTokenPermission()`: Approves token spending permission in MetaMask
   - `cy.rejectTokenPermission()`: Rejects token spending permission in MetaMask
   - `cy.toggleShowTestNetworks()`: Toggles the display of test networks in MetaMask
   - `cy.toggleDismissSecretRecoveryPhraseReminder()`: Toggles the dismissal of the secret recovery phrase reminder
   - `cy.providePublicEncryptionKey()`: Provides a public encryption key
   - `cy.decrypt()`: Decrypts encrypted data
   - `cy.confirmSignature()`: Confirms a signature request in MetaMask
   - `cy.rejectSignature()`: Rejects a signature request in MetaMask
   - `cy.confirmTransactionAndWaitForMining()`: Confirms a transaction and waits for it to be mined
   - `cy.openTransactionDetails()`: Opens transaction details in MetaMask
   - `cy.closeTransactionDetails()`: Closes transaction details in MetaMask
   - `cy.goBackToHomePage()`: Returns to the MetaMask home page
   - `cy.openSettings()`: Opens MetaMask settings
   - `cy.openSidebarMenu()`: Opens a specific sidebar menu in MetaMask settings

Note: The `setupMetamask()` function is not present in the provided file. Some commands like `connectToDapp()`, `disconnectFromDapp()`, `switchNetwork()`, `lock()`, `unlock()`, `confirmTransaction()`, and `rejectTransaction()` were present in Synpress v3 and have been retained or slightly modified in v4. This list focuses on the new or significantly changed commands in v4.

7. **Advanced Transaction Handling in v4**:
   - `cy.confirmTransaction()` now supports advanced options:
     ```typescript
     cy.confirmTransaction({
       gasSetting: 'low' | 'medium' | 'high' | {
         maxBaseFee: number,
         priorityFee: number,
         gasLimit?: number
       }
     })
     ```
   This allows for more granular control over gas settings during transaction confirmation.

When migrating from v3 to v4, carefully review your existing tests and update the commands according to these changes. Also, consult the latest Synpress v4 documentation for any additional new features or commands that may have been introduced.
