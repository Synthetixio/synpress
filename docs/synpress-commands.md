# Synprss Commands

#### `cy.initPlaywright()`

Connect playwright with Cypress instance.

```ts
initPlaywright(): Chainable<boolean>;
```

#### `cy.assignWindows()`

Assign currently open tabs with playwright.

```ts
assignWindows(): Chainable<boolean>;
```

#### `cy.assignActiveTabName()`

Assigns currently active tab.

```ts
assignActiveTabName(tabName: string): Chainable<boolean>;
```

#### `cy.isMetamaskWindowActive()`

Checks if current active tab is metamask.

```ts
isMetamaskWindowActive(): Chainable<boolean>;
```

#### `cy.isCypressWindowActive()`

Checks if current active tab is cypress.

```ts
isCypressWindowActive(): Chainable<boolean>;
```

#### `cy.switchToCypressWindow()`

Switch to Cypress window.

```ts
switchToCypressWindow(): Chainable<boolean>;
```

#### `cy.switchToMetamaskWindow()`

Switch to metamask window.

```ts
switchToMetamaskWindow(): Chainable<boolean>;
```

#### `cy.switchToMetamaskNotification()`

Switch to metamask notification window.

```ts
switchToMetamaskNotification(): Chainable<boolean>;
```

#### `cy.getCurrentNetwork()`

Get current network.

```ts
getCurrentNetwork(): Chainable<Subject>;
```

#### `cy.addMetamaskNetwork()`

Add network in metamask (and also switch to the newly added network).

```ts
addMetamaskNetwork(
  network:
    | string
    | {
        networkName: string;
        rpcUrl: string;
        chainId: number;
        symbol?: string;
        blockExplorer?: string;
        isTestnet: boolean;
      },
): Chainable<boolean>;
```

#### `cy.changeMetamaskNetwork()`

Change network in metamask (if network is not present, it will be added).

```ts
changeMetamaskNetwork(network: string): Chainable<boolean>;
```

#### `cy.importMetamaskAccount()`

Import new account in metamask using private key.

```ts
importMetamaskAccount(privateKey: string): Chainable<boolean>;
```

#### `cy.createMetamaskAccount()`

Create new account in metamask.

```ts
createMetamaskAccount(accountName?: string): Chainable<boolean>;
```

#### `cy.renameMetamaskAccount()`

Rename current account in metamask.

```ts
renameMetamaskAccount(newAccountName: string): Chainable<boolean>;
```

#### `cy.switchMetamaskAccount()`

Switch metamask account.

```ts
switchMetamaskAccount(
  accountNameOrAccountNumber: string | number,
): Chainable<boolean>;
```

#### `cy.getMetamaskWalletAddress()`

Get current wallet address of metamask wallet.

```ts
getMetamaskWalletAddress(): Chainable<string>;
```

#### `cy.activateAdvancedGasControlInMetamask()`

Activate ability (in metamask settings) to specify custom gas price and limit
while doing transactions in metamask.

```ts
activateAdvancedGasControlInMetamask(
  skipSetup?: boolean,
): Chainable<boolean>;
```

#### `cy.activateShowHexDataInMetamask()`

Activate ability (in metamask settings) to show hex data while doing transaction
in metamask.

```ts
activateShowHexDataInMetamask(skipSetup?: boolean): Chainable<boolean>;
```

#### `cy.activateTestnetConversionInMetamask()`

Activate ability (in metamask settings) to show fiat conversions on testnets in
metamask.

```ts
activateTestnetConversionInMetamask(
  skipSetup?: boolean,
): Chainable<boolean>;
```

#### `cy.activateShowTestnetNetworksInMetamask()`

Activate ability (in metamask settings) to show testnet networks in metamask.

```ts
activateShowTestnetNetworksInMetamask(
  skipSetup?: boolean,
): Chainable<boolean>;
```

#### `cy.activateCustomNonceInMetamask()`

Activate ability (in metamask settings) to specify custom nonce while doing
transactions in metamask.

```ts
activateCustomNonceInMetamask(skipSetup?: boolean): Chainable<boolean>;
```

#### `cy.activateDismissBackupReminderInMetamask()`

Activate ability (in metamask settings) to dismiss secret recovery phrase
reminder in metamask.

```ts
activateDismissBackupReminderInMetamask(
  skipSetup?: boolean,
): Chainable<boolean>;
```

#### `cy.activateEthSignRequestsInMetamask()`

Activate eth sign requests in metamask settings.

```ts
activateEthSignRequestsInMetamask(skipSetup?: boolean): Chainable<boolean>;
```

#### `cy.activateImprovedTokenAllowanceInMetamask()`

Activate improved token allowance in metamask settings (experimental).

```ts
activateImprovedTokenAllowanceInMetamask(
  skipSetup?: boolean,
): Chainable<boolean>;
```

#### `cy.resetMetamaskAccount()`

Reset metamask account state in settings.

```ts
resetMetamaskAccount(): Chainable<boolean>;
```

#### `cy.disconnectMetamaskWalletFromDapp()`

Disconnects metamask wallet from last connected dapp.

```ts
disconnectMetamaskWalletFromDapp(): Chainable<boolean>;
```

#### `cy.disconnectMetamaskWalletFromAllDapps()`

Disconnects metamask wallet from all connected dapps.

```ts
disconnectMetamaskWalletFromAllDapps(): Chainable<boolean>;
```

#### `cy.confirmMetamaskSignatureRequest()`

Confirm metamask permission to sign message.

```ts
confirmMetamaskSignatureRequest(): Chainable<boolean>;
```

#### `cy.confirmMetamaskDataSignatureRequest()`

Confirm metamask permission to sign Data message.

```ts
confirmMetamaskDataSignatureRequest(): Chainable<boolean>;
```

#### `cy.rejectMetamaskSignatureRequest()`

Reject metamask permission to sign message.

```ts
rejectMetamaskSignatureRequest(): Chainable<boolean>;
```

#### `cy.confirmMetamaskEncryptionPublicKeyRequest()`

Confirm metamask request for public encryption key.

```ts
confirmMetamaskEncryptionPublicKeyRequest(): Chainable<boolean>;
```

#### `cy.rejectMetamaskEncryptionPublicKeyRequest()`

Reject metamask request for public encryption key.

```ts
rejectMetamaskEncryptionPublicKeyRequest(): Chainable<boolean>;
```

#### `cy.confirmMetamaskDecryptionRequest()`

Confirm metamask request to decrypt message with private key.

```ts
confirmMetamaskDecryptionRequest(): Chainable<boolean>;
```

#### `cy.rejectMetamaskDecryptionRequest()`

Reject metamask request to decrypt message with private key.

```ts
rejectMetamaskDecryptionRequest(): Chainable<boolean>;
```

#### `cy.rejectMetamaskDataSignatureRequest()`

Reject metamask permission to sign Data message.

```ts
rejectMetamaskDataSignatureRequest(): Chainable<boolean>;
```

#### `cy.importMetamaskToken()`

Add custom token to metamask.

```ts
importMetamaskToken(
  tokenConfig?:
    | {
        address: string;
        symbol: string;
      }
    | string,
): Chainable<boolean>;
```

#### `cy.confirmMetamaskAddToken()`

Confirm metamask request to add token.

```ts
confirmMetamaskAddToken(): Chainable<boolean>;
```

#### `cy.rejectMetamaskAddToken()`

Reject metamask request to add token.

```ts
rejectMetamaskAddToken(): Chainable<boolean>;
```

#### `cy.confirmMetamaskPermissionToSpend()`

Confirm metamask permission to spend asset.

```ts
confirmMetamaskPermissionToSpend(options: {
  spendLimit?: string
  shouldWaitForPopupClosure?: boolean
}): Chainable<string>;
```

#### `cy.confirmMetamaskPermissionToApproveAll()`

Confirm metamask permission to access all elements (example: collectibles).

```ts
confirmMetamaskPermissionToApproveAll(): Chainable<boolean>;
```

#### `cy.rejectMetamaskPermissionToApproveAll()`

Reject metamask permission to access all elements (example: collectibles).

```ts
rejectMetamaskPermissionToApproveAll(): Chainable<boolean>;
```

#### `cy.confirmMetamaskRevokePermissionToAll()`

Confirm metamask revoking permission to access all elements (example:
collectibles).

```ts
confirmMetamaskRevokePermissionToAll(): Chainable<boolean>;
```

#### `cy.rejectMetamaskRevokePermissionToAll()`

Reject metamask revoking permission to access all elements (example:
collectibles).

```ts
rejectMetamaskRevokePermissionToAll(): Chainable<boolean>;
```

#### `cy.rejectMetamaskPermissionToSpend()`

Reject metamask permission to spend asset.

```ts
rejectMetamaskPermissionToSpend(): Chainable<boolean>;
```

#### `cy.acceptMetamaskAccess()`

Accept metamask access request.

```ts
acceptMetamaskAccess(options?: {
  allAccounts?: boolean;
  confirmSignatureRequest?: boolean;
  confirmDataSignatureRequest?: boolean;
  switchNetwork?: boolean;
}): Chainable<boolean>;
```

#### `cy.rejectMetamaskAccess()`

Reject metamask access request.

```ts
rejectMetamaskAccess(): Chainable<boolean>;
```

#### `cy.confirmMetamaskTransaction()`

Confirm metamask transaction (auto-detects eip-1559 and legacy transactions).

```ts
confirmMetamaskTransaction(options: {
  gasConfig:
    | {
      gasLimit?: number;
      baseFee?: number;
      priorityFee?: number;
      }
    | {
      gasLimit?: number;
      gasPrice?: number;
    }
    | 'low'
    | 'market'
    | 'aggressive'
    | 'site', 
  shouldWaitForPopupClosure?: boolean
}): Chainable<Subject>;
```

#### `cy.confirmMetamaskTransactionAndWaitForMining()`

Confirm metamask transaction (auto-detects eip-1559 and legacy transactions) and
wait for ALL pending transactions to be mined.

```ts
confirmMetamaskTransactionAndWaitForMining(
  gasConfig?:
    | {
        gasLimit?: number;
        baseFee?: number;
        priorityFee?: number;
      }
    | {
        gasLimit?: number;
        gasPrice?: number;
      }
    | 'low'
    | 'market'
    | 'aggressive'
    | 'site',
): Chainable<Subject>;
```

#### `cy.rejectMetamaskTransaction()`

Reject metamask transaction.

```ts
rejectMetamaskTransaction(): Chainable<boolean>;
```

#### `cy.openMetamaskTransactionDetails()`

Open metamask transaction details based on the index of the transaction in the
list on the activity tab.

```ts
openMetamaskTransactionDetails(txIndex: number): Chainable<Subject>;
```

#### `cy.closeMetamaskTransactionDetailsPopup()`

Close metamask transaction details popup.

```ts
closeMetamaskTransactionDetailsPopup(): Chainable<boolean>;
```

#### `cy.allowMetamaskToAddNetwork()`

Allow site to add new network in metamask.

```ts
allowMetamaskToAddNetwork(waitForEvent?: string): Chainable<boolean>;
```

#### `cy.rejectMetamaskToAddNetwork()`

Reject site to add new network in metamask.

```ts
rejectMetamaskToAddNetwork(): Chainable<boolean>;
```

#### `cy.allowMetamaskToSwitchNetwork()`

Allow site to switch network in metamask.

```ts
allowMetamaskToSwitchNetwork(): Chainable<boolean>;
```

#### `cy.rejectMetamaskToSwitchNetwork()`

Reject site to switch network in metamask.

```ts
rejectMetamaskToSwitchNetwork(): Chainable<boolean>;
```

#### `cy.allowMetamaskToAddAndSwitchNetwork()`

Allow site to add new network in metamask and switch to it.

```ts
allowMetamaskToAddAndSwitchNetwork(): Chainable<boolean>;
```

#### `cy.unlockMetamask()`

Unlock metamask.

```ts
unlockMetamask(password: string): Chainable<boolean>;
```

#### `cy.fetchMetamaskWalletAddress()`

Fetches previous metamask wallet address.

```ts
fetchMetamaskWalletAddress(): Chainable<boolean>;
```

#### `cy.setupMetamask()`

Run the flow for metamask setup.

```ts
setupMetamask(
  secretWordsOrPrivateKey?: string,
  network?:
    | string
    | {
        networkName: string;
        rpcUrl: string;
        chainId: number;
        symbol?: string;
        blockExplorer?: string;
        isTestnet: boolean;
      },
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
etherscanWaitForTxSuccess(txid: string): Chainable<boolean>;
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
