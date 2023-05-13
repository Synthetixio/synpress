# Synprss Commands

#### `cy.initPlaywright()`

Connect playwright with Cypress instance.

```ts
initPlaywright(): Chainable<Subject>;
```

#### `cy.assignWindows()`

Assign currently open tabs with playwright.

```ts
assignWindows(): Chainable<Subject>;
```

#### `cy.assignActiveTabName()`

Assigns currently active tab.

```ts
assignActiveTabName(): Chainable<Subject>;
```

#### `cy.isMetamaskWindowActive()`

Checks if current active tab is metamask.

```ts
isMetamaskWindowActive(): Chainable<Subject>;
```

#### `cy.isCypressWindowActive()`

Checks if current active tab is cypress.

```ts
isCypressWindowActive(): Chainable<Subject>;
```

#### `cy.switchToCypressWindow()`

Switch to Cypress window.

```ts
switchToCypressWindow(): Chainable<Subject>;
```

#### `cy.switchToMetamaskWindow()`

Switch to metamask window.

```ts
switchToMetamaskWindow(): Chainable<Subject>;
```

#### `cy.switchToMetamaskNotification()`

Switch to metamask notification window.

```ts
switchToMetamaskNotification(): Chainable<Subject>;
```

#### `cy.getCurrentNetwork()`

Get current network.

```ts
getCurrentNetwork(): Chainable<Subject>;
```

#### `cy.addMetamaskNetwork()`

Add network in metamask (and also switch to the newly added network).

```ts
addMetamaskNetwork(network: object): Chainable<Subject>;
```

#### `cy.changeMetamaskNetwork()`

Change network in metamask.

```ts
changeMetamaskNetwork(network: string): Chainable<Subject>;
```

#### `cy.importMetamaskAccount()`

Import new account in metamask using private key.

```ts
importMetamaskAccount(privateKey: string): Chainable<Subject>;
```

#### `cy.createMetamaskAccount()`

Create new account in metamask.

```ts
createMetamaskAccount(accountName?: string): Chainable<Subject>;
```

#### `cy.switchMetamaskAccount()`

Switch metamask account.

```ts
switchMetamaskAccount(
  accountNameOrAccountNumber: string | number,
): Chainable<Subject>;
```

#### `cy.getMetamaskWalletAddress()`

Get current wallet address of metamask wallet.

```ts
getMetamaskWalletAddress(): Chainable<Subject>;
```

#### `cy.activateAdvancedGasControlInMetamask()`

Activate ability (in metamask settings) to specify custom gas price and limit while doing transactions in metamask.

```ts
activateAdvancedGasControlInMetamask(
  skipSetup?: boolean,
): Chainable<Subject>;
```

#### `cy.activateShowHexDataInMetamask()`

Activate ability (in metamask settings) to show hex data while doing transaction in metamask.

```ts
activateShowHexDataInMetamask(skipSetup?: boolean): Chainable<Subject>;
```

#### `cy.activateTestnetConversionInMetamask()`

Activate ability (in metamask settings) to show fiat conversions on testnets in metamask.

```ts
activateTestnetConversionInMetamask(
  skipSetup?: boolean,
): Chainable<Subject>;
```

#### `cy.activateShowTestnetNetworksInMetamask()`

Activate ability (in metamask settings) to show testnet networks in metamask.

```ts
activateShowTestnetNetworksInMetamask(
  skipSetup?: boolean,
): Chainable<Subject>;
```

#### `cy.activateCustomNonceInMetamask()`

Activate ability (in metamask settings) to specify custom nonce while doing transactions in metamask.

```ts
activateCustomNonceInMetamask(skipSetup?: boolean): Chainable<Subject>;
```

#### `cy.activateDismissBackupReminderInMetamask()`

Activate ability (in metamask settings) to dismiss secret recovery phrase reminder in metamask.

```ts
activateDismissBackupReminderInMetamask(
  skipSetup?: boolean,
): Chainable<Subject>;
```

#### `cy.activateEthSignRequestsInMetamask()`

Activate eth sign requests in metamask settings.

```ts
activateEthSignRequestsInMetamask(skipSetup?: boolean): Chainable<Subject>;
```

#### `cy.activateImprovedTokenAllowanceInMetamask()`

Activate improved token allowance in metamask settings (experimental).

```ts
activateImprovedTokenAllowanceInMetamask(
  skipSetup?: boolean,
): Chainable<Subject>;
```

#### `cy.resetMetamaskAccount()`

Reset metamask account state in settings.

```ts
resetMetamaskAccount(): Chainable<Subject>;
```

#### `cy.disconnectMetamaskWalletFromDapp()`

Disconnects metamask wallet from last connected dapp.

```ts
disconnectMetamaskWalletFromDapp(): Chainable<Subject>;
```

#### `cy.disconnectMetamaskWalletFromAllDapps()`

Disconnects metamask wallet from all connected dapps.

```ts
disconnectMetamaskWalletFromAllDapps(): Chainable<Subject>;
```

#### `cy.confirmMetamaskSignatureRequest()`

Confirm metamask permission to sign message.

```ts
confirmMetamaskSignatureRequest(): Chainable<Subject>;
```

#### `cy.confirmMetamaskDataSignatureRequest()`

Confirm metamask permission to sign Data message.

```ts
confirmMetamaskDataSignatureRequest(): Chainable<Subject>;
```

#### `cy.rejectMetamaskSignatureRequest()`

Reject metamask permission to sign message.

```ts
rejectMetamaskSignatureRequest(): Chainable<Subject>;
```

#### `cy.confirmMetamaskEncryptionPublicKeyRequest()`

Confirm metamask request for public encryption key.

```ts
confirmMetamaskEncryptionPublicKeyRequest(): Chainable<Subject>;
```

#### `cy.rejectMetamaskEncryptionPublicKeyRequest()`

Reject metamask request for public encryption key.

```ts
rejectMetamaskEncryptionPublicKeyRequest(): Chainable<Subject>;
```

#### `cy.confirmMetamaskDecryptionRequest()`

Confirm metamask request to decrypt message with private key.

```ts
confirmMetamaskDecryptionRequest(): Chainable<Subject>;
```

#### `cy.rejectMetamaskDecryptionRequest()`

Reject metamask request to decrypt message with private key.

```ts
rejectMetamaskDecryptionRequest(): Chainable<Subject>;
```

#### `cy.rejectMetamaskDataSignatureRequest()`

Reject metamask permission to sign Data message.

```ts
rejectMetamaskDataSignatureRequest(): Chainable<Subject>;
```

#### `cy.importMetamaskToken()`

Add custom token to metamask.

```ts
importMetamaskToken(tokenConfig?: object | string): Chainable<Subject>;
```

#### `cy.confirmMetamaskAddToken()`

Confirm metamask request to add token.

```ts
confirmMetamaskAddToken(): Chainable<Subject>;
```

#### `cy.rejectMetamaskAddToken()`

Reject metamask request to add token.

```ts
rejectMetamaskAddToken(): Chainable<Subject>;
```

#### `cy.confirmMetamaskPermissionToSpend()`

Confirm metamask permission to spend asset.

```ts
confirmMetamaskPermissionToSpend(spendLimit?: string): Chainable<Subject>;
```

#### `cy.confirmMetamaskPermisionToApproveAll()`

Confirm metamask permission to access all elements (example: collectibles).

```ts
confirmMetamaskPermisionToApproveAll(): Chainable<Subject>;
```

#### `cy.rejectMetamaskPermisionToApproveAll()`

Reject metamask permission to access all elements (example: collectibles).

```ts
rejectMetamaskPermisionToApproveAll(): Chainable<Subject>;
```

#### `cy.rejectMetamaskPermissionToSpend()`

Reject metamask permission to spend asset.

```ts
rejectMetamaskPermissionToSpend(): Chainable<Subject>;
```

#### `cy.acceptMetamaskAccess()`

Accept metamask access request.

```ts
acceptMetamaskAccess(options?: {
  allAccounts?: boolean;
  confirmSignatureRequest?: boolean;
  confirmDataSignatureRequest?: boolean;
}): Chainable<Subject>;
```

#### `cy.confirmMetamaskTransaction()`

Confirm metamask transaction (auto-detects eip-1559 and legacy transactions).

```ts
confirmMetamaskTransaction(gasConfig?: object | string): Chainable<Subject>;
```

#### `cy.rejectMetamaskTransaction()`

Reject metamask transaction.

```ts
rejectMetamaskTransaction(): Chainable<Subject>;
```

#### `cy.allowMetamaskToAddNetwork()`

Allow site to add new network in metamask.

```ts
allowMetamaskToAddNetwork(waitForEvent?: string): Chainable<Subject>;
```

#### `cy.rejectMetamaskToAddNetwork()`

Reject site to add new network in metamask.

```ts
rejectMetamaskToAddNetwork(): Chainable<Subject>;
```

#### `cy.allowMetamaskToSwitchNetwork()`

Allow site to switch network in metamask.

```ts
allowMetamaskToSwitchNetwork(): Chainable<Subject>;
```

#### `cy.rejectMetamaskToSwitchNetwork()`

Reject site to switch network in metamask.

```ts
rejectMetamaskToSwitchNetwork(): Chainable<Subject>;
```

#### `cy.allowMetamaskToAddAndSwitchNetwork()`

Allow site to add new network in metamask and switch to it.

```ts
allowMetamaskToAddAndSwitchNetwork(): Chainable<Subject>;
```

#### `cy.unlockMetamask()`

Unlock metamask.

```ts
unlockMetamask(password: string): Chainable<Subject>;
```

#### `cy.fetchMetamaskWalletAddress()`

Fetches previous metamask wallet address.

```ts
fetchMetamaskWalletAddress(): Chainable<Subject>;
```

#### `cy.setupMetamask()`

Run the flow for metamask setup.

```ts
setupMetamask(
  secretWordsOrPrivateKey?: string,
  network?: string | object,
  password?: string,
  enableAdvancedSettings?: boolean,
  enableExperimentalSettings?: boolean,
): Chainable<Subject>;
```

#### `cy.etherscanGetTransactionStatus()`

Get transaction status from Etherscan API.

```ts
etherscanGetTransactionStatus(txid: string): Chainable<Subject>;
```

#### `cy.etherscanWaitForTxSuccess()`

Wait until transaction is success using Etherscan API.

```ts
etherscanWaitForTxSuccess(txid: string): Chainable<Subject>;
```

#### `cy.waitForResources()`

Wait until all XHR requests are finished (networkidle0).

```ts
waitForResources(
  resources?: Array<{ name: string; number?: number }>,
): Chainable<Subject>;
```

#### `cy.topIsWithinViewport()`

Assert that element top is within viewport.

```ts
topIsWithinViewport(viewportWidth: number): Chainable<Subject>;
```

#### `cy.isWithinViewport()`

Assert that element is within viewport.

```ts
isWithinViewport(
  viewportWidth: number,
  viewportHeight: number,
): Chainable<Subject>;
```

