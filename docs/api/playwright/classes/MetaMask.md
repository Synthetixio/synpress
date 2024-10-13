# Class: MetaMask

MetaMask class for interacting with the MetaMask extension in Playwright tests.

This class provides methods to perform various operations on the MetaMask extension,
such as importing wallets, switching networks, confirming transactions, and more.

## Extends

- `MetaMaskAbstract`

## Constructors

### new MetaMask()

```ts
new MetaMask(
   context, 
   page, 
   password, 
   extensionId?): MetaMask
```

Creates an instance of MetaMask.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `context` | `BrowserContext` | The Playwright BrowserContext in which the MetaMask extension is running. |
| `page` | `Page` | The Playwright Page object representing the MetaMask extension's main page. |
| `password` | `string` | The password for the MetaMask wallet. |
| `extensionId`? | `string` | The ID of the MetaMask extension. Optional if no interaction with dapps is required. |

#### Returns

[`MetaMask`](MetaMask.md)

#### Overrides

`MetaMaskAbstract.constructor`

## Properties

| Property | Modifier | Type | Description | Overrides |
| :------ | :------ | :------ | :------ | :------ |
| `context` | `readonly` | `BrowserContext` | - | - |
| `crashPage` | `readonly` | `CrashPage` | This property can be used to access selectors for the crash page. | - |
| `extensionId?` | `readonly` | `string` | - | `MetaMaskAbstract.extensionId` |
| `homePage` | `readonly` | `HomePage` | This property can be used to access selectors for the home page. | - |
| `lockPage` | `readonly` | `LockPage` | This property can be used to access selectors for the lock page. | - |
| `notificationPage` | `readonly` | `NotificationPage` | This property can be used to access selectors for the notification page. | - |
| `onboardingPage` | `readonly` | `OnboardingPage` | This property can be used to access selectors for the onboarding page. | - |
| `page` | `readonly` | `Page` | - | - |
| `password` | `readonly` | `string` | - | `MetaMaskAbstract.password` |
| `settingsPage` | `readonly` | `SettingsPage` | This property can be used to access selectors for the settings page. | - |

## Methods

### addNetwork()

```ts
addNetwork(network): Promise<void>
```

Adds a new network to MetaMask.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `network` | `object` | The network configuration to add. |
| `network.blockExplorerUrl`? | `string` | - |
| `network.chainId` | `number` | - |
| `network.name` | `string` | - |
| `network.rpcUrl` | `string` | - |
| `network.symbol` | `string` | - |

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.addNetwork`

***

### addNewAccount()

```ts
addNewAccount(accountName): Promise<void>
```

Adds a new account with the given name.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `accountName` | `string` | The name for the new account. |

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.addNewAccount`

***

### addNewToken()

```ts
addNewToken(): Promise<void>
```

Adds a new token.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.addNewToken`

#### Throws

If extensionId is not set.

***

### approveNewNetwork()

```ts
approveNewNetwork(): Promise<void>
```

Approves adding a new network.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.approveNewNetwork`

#### Throws

If extensionId is not set.

***

### approveSwitchNetwork()

```ts
approveSwitchNetwork(): Promise<void>
```

Approves switching to a new network.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.approveSwitchNetwork`

#### Throws

If extensionId is not set.

***

### approveTokenPermission()

```ts
approveTokenPermission(options?): Promise<void>
```

Approves a token permission request.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options`? | `object` | Optional settings for the approval. |
| `options.gasSetting`? |  \| `"low"` \| `"market"` \| `"aggressive"` \| `"site"` \| \{ `"gasLimit"`: `number`; `"maxBaseFee"`: `number`; `"priorityFee"`: `number`; \} | - |
| `options.spendLimit`? | `number` \| `"max"` | - |

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.approveTokenPermission`

#### Throws

If extensionId is not set.

***

### closeTransactionDetails()

```ts
closeTransactionDetails(): Promise<void>
```

Closes the transaction details view.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.closeTransactionDetails`

***

### confirmSignature()

```ts
confirmSignature(): Promise<void>
```

Confirms a signature request.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.confirmSignature`

#### Throws

If extensionId is not set.

***

### confirmSignatureWithRisk()

```ts
confirmSignatureWithRisk(): Promise<void>
```

Confirms a signature request with risk.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.confirmSignatureWithRisk`

#### Throws

If extensionId is not set.

***

### confirmTransaction()

```ts
confirmTransaction(options?): Promise<void>
```

Confirms a transaction.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options`? | `object` | Optional gas settings for the transaction. |
| `options.gasSetting`? |  \| `"low"` \| `"market"` \| `"aggressive"` \| `"site"` \| \{ `"gasLimit"`: `number`; `"maxBaseFee"`: `number`; `"priorityFee"`: `number`; \} | - |

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.confirmTransaction`

#### Throws

If extensionId is not set.

***

### confirmTransactionAndWaitForMining()

```ts
confirmTransactionAndWaitForMining(options?): Promise<void>
```

Confirms a transaction and waits for it to be mined.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options`? | `object` | Optional gas settings for the transaction. |
| `options.gasSetting`? |  \| `"low"` \| `"market"` \| `"aggressive"` \| `"site"` \| \{ `"gasLimit"`: `number`; `"maxBaseFee"`: `number`; `"priorityFee"`: `number`; \} | - |

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.confirmTransactionAndWaitForMining`

#### Throws

If extensionId is not set.

***

### connectToDapp()

```ts
connectToDapp(accounts?): Promise<void>
```

Connects MetaMask to a dapp.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `accounts`? | `string`[] | Optional array of account addresses to connect. |

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.connectToDapp`

#### Throws

If extensionId is not set.

***

### decrypt()

```ts
decrypt(): Promise<void>
```

Decrypts a message.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.decrypt`

#### Throws

If extensionId is not set.

***

### disableEthSign()

```ts
disableEthSign(): Promise<void>
```

Disables eth_sign.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.disableEthSign`

***

### getAccountAddress()

```ts
getAccountAddress(): Promise<string>
```

Gets the address of the currently selected account.

#### Returns

`Promise`\<`string`\>

The account address.

#### Overrides

`MetaMaskAbstract.getAccountAddress`

***

### goBackToHomePage()

```ts
goBackToHomePage(): Promise<void>
```

Navigates back to the home page.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.goBackToHomePage`

***

### importWallet()

```ts
importWallet(seedPhrase): Promise<void>
```

Imports a wallet using the given seed phrase.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `seedPhrase` | `string` | The seed phrase to import. |

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.importWallet`

***

### importWalletFromPrivateKey()

```ts
importWalletFromPrivateKey(privateKey): Promise<void>
```

Imports a wallet using the given private key.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `string` | The private key to import. |

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.importWalletFromPrivateKey`

***

### lock()

```ts
lock(): Promise<void>
```

Locks the MetaMask wallet.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.lock`

***

### openSettings()

```ts
openSettings(): Promise<void>
```

Opens the settings page.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.openSettings`

***

### openSidebarMenu()

```ts
openSidebarMenu(menu): Promise<void>
```

Opens a specific sidebar menu in the settings.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `menu` | `SettingsSidebarMenus` | The menu to open. |

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.openSidebarMenu`

***

### openTransactionDetails()

```ts
openTransactionDetails(txIndex): Promise<void>
```

Opens the details of a specific transaction.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `txIndex` | `number` | The index of the transaction to open. |

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.openTransactionDetails`

***

### providePublicEncryptionKey()

```ts
providePublicEncryptionKey(): Promise<void>
```

Provides a public encryption key.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.providePublicEncryptionKey`

#### Throws

If extensionId is not set.

***

### rejectNewNetwork()

```ts
rejectNewNetwork(): Promise<void>
```

Rejects adding a new network.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.rejectNewNetwork`

#### Throws

If extensionId is not set.

***

### rejectSignature()

```ts
rejectSignature(): Promise<void>
```

Rejects a signature request.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.rejectSignature`

#### Throws

If extensionId is not set.

***

### rejectSwitchNetwork()

```ts
rejectSwitchNetwork(): Promise<void>
```

Rejects switching to a new network.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.rejectSwitchNetwork`

#### Throws

If extensionId is not set.

***

### rejectTokenPermission()

```ts
rejectTokenPermission(): Promise<void>
```

Rejects a token permission request.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.rejectTokenPermission`

#### Throws

If extensionId is not set.

***

### rejectTransaction()

```ts
rejectTransaction(): Promise<void>
```

Rejects a transaction.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.rejectTransaction`

#### Throws

If extensionId is not set.

***

### renameAccount()

```ts
renameAccount(currentAccountName, newAccountName): Promise<void>
```

Renames the currently selected account.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `currentAccountName` | `string` | The current account name. |
| `newAccountName` | `string` | The new name for the account. |

#### Returns

`Promise`\<`void`\>

***

### resetAccount()

```ts
resetAccount(): Promise<void>
```

Resets the account.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.resetAccount`

***

### switchAccount()

```ts
switchAccount(accountName): Promise<void>
```

Switches to the account with the given name.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `accountName` | `string` | The name of the account to switch to. |

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.switchAccount`

***

### switchNetwork()

```ts
switchNetwork(networkName, isTestnet?): Promise<void>
```

Switches to the specified network.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `networkName` | `string` | The name of the network to switch to. |
| `isTestnet`? | `boolean` | Whether the network is a testnet. Default is false. |

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.switchNetwork`

***

### toggleDismissSecretRecoveryPhraseReminder()

```ts
toggleDismissSecretRecoveryPhraseReminder(): Promise<void>
```

Toggles the dismissal of the secret recovery phrase reminder.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.toggleDismissSecretRecoveryPhraseReminder`

***

### toggleShowTestNetworks()

```ts
toggleShowTestNetworks(): Promise<void>
```

Toggles the display of test networks.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.toggleShowTestNetworks`

***

### unlock()

```ts
unlock(): Promise<void>
```

Unlocks the MetaMask wallet.

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.unlock`

***

### unsafe\_enableEthSign()

```ts
unsafe_enableEthSign(): Promise<void>
```

Enables eth_sign (unsafe).

#### Returns

`Promise`\<`void`\>

#### Overrides

`MetaMaskAbstract.unsafe_enableEthSign`
