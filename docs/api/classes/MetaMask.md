# Class: MetaMask

This class is the heart of Synpress's MetaMask API.

## Constructors

### new MetaMask()

```ts
new MetaMask(
   context, 
   page, 
   password, 
   extensionId?): MetaMask
```

Class constructor.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `context` | `BrowserContext` | The browser context. |
| `page` | `Page` | The MetaMask tab page. |
| `password` | `string` | The password of the MetaMask wallet. |
| `extensionId`? | `string` | The extension ID of the MetaMask extension. Optional if no interaction with the dapp is required. |

#### Returns

[`MetaMask`](MetaMask.md)

A new instance of the MetaMask class.

## Properties

| Property | Modifier | Type | Description |
| :------ | :------ | :------ | :------ |
| `context` | `readonly` | `BrowserContext` | The browser context. |
| `extensionId?` | `readonly` | `string` | The extension ID of the MetaMask extension. Optional if no interaction with the dapp is required. |
| `page` | `readonly` | `Page` | The MetaMask tab page. |
| `password` | `readonly` | `string` | The password of the MetaMask wallet. |
| `settingsPage` | `readonly` | `SettingsPage` | - |

## Methods

### addNetwork()

```ts
addNetwork(network): Promise<void>
```

Adds a new network.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `network` | `object` | The network object to use for adding the new network. |
| `network.blockExplorerUrl`? | `string` | The block explorer URL of the network. |
| `network.chainId` | `number` | The chain ID of the network. |
| `network.name` | `string` | The name of the network. |
| `network.rpcUrl` | `string` | The RPC URL of the network. |
| `network.symbol` | `string` | The currency symbol of the network. |

#### Returns

`Promise`\<`void`\>

***

### addNewAccount()

```ts
addNewAccount(accountName): Promise<void>
```

Adds a new account with the given name. This account is based on the initially imported seed phrase.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `accountName` | `string` | The name of the new account. |

#### Returns

`Promise`\<`void`\>

***

### addNewToken()

```ts
addNewToken(): Promise<void>
```

#### Returns

`Promise`\<`void`\>

***

### approveNewNetwork()

```ts
approveNewNetwork(): Promise<void>
```

Approves a new network request.

#### Returns

`Promise`\<`void`\>

***

### approveSwitchNetwork()

```ts
approveSwitchNetwork(): Promise<void>
```

Approves a switch network request.

#### Returns

`Promise`\<`void`\>

***

### approveTokenPermission()

```ts
approveTokenPermission(options?): Promise<void>
```

Approves a permission request to spend tokens.

::: warning
For NFT approvals, use `confirmTransaction` method.
:::

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options`? | `object` | The permission options. |
| `options.gasSetting`? |  \| `"low"` \| `"market"` \| `"aggressive"` \| `"site"` \| \{ `"gasLimit"`: `number`; `"maxBaseFee"`: `number`; `"priorityFee"`: `number`; \} | The gas setting to use for the approval transaction. |
| `options.spendLimit`? | `number` \| `"max"` | The spend limit to use for the permission. |

#### Returns

`Promise`\<`void`\>

***

### confirmSignature()

```ts
confirmSignature(): Promise<void>
```

Confirms a signature request. This function supports all types of commonly used signatures.

#### Returns

`Promise`\<`void`\>

***

### confirmSignatureWithRisk()

```ts
confirmSignatureWithRisk(): Promise<void>
```

Confirms a signature request with potential risk.

#### Returns

`Promise`\<`void`\>

***

### confirmTransaction()

```ts
confirmTransaction(options?): Promise<void>
```

Confirms a transaction request.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options`? | `object` | The transaction options. |
| `options.gasSetting`? |  \| `"low"` \| `"market"` \| `"aggressive"` \| `"site"` \| \{ `"gasLimit"`: `number`; `"maxBaseFee"`: `number`; `"priorityFee"`: `number`; \} | The gas setting to use for the transaction. |

#### Returns

`Promise`\<`void`\>

***

### connectToDapp()

```ts
connectToDapp(accounts?): Promise<void>
```

Connects to the dapp using the currently selected account.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `accounts`? | `string`[] |

#### Returns

`Promise`\<`void`\>

***

### decrypt()

```ts
decrypt(): Promise<void>
```

#### Returns

`Promise`\<`void`\>

***

### disableEthSign()

```ts
disableEthSign(): Promise<void>
```

Disables the eth_sign feature in MetaMask advanced settings.

#### Returns

`Promise`\<`void`\>

***

### getAccountAddress()

```ts
getAccountAddress(): Promise<string>
```

Retrieves the current account address.

#### Returns

`Promise`\<`string`\>

***

### goBackToHomePage()

```ts
goBackToHomePage(): Promise<void>
```

Goes back to the home page of MetaMask tab.

#### Returns

`Promise`\<`void`\>

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

***

### lock()

```ts
lock(): Promise<void>
```

Locks MetaMask.

#### Returns

`Promise`\<`void`\>

***

### openSettings()

```ts
openSettings(): Promise<void>
```

Opens the settings page.

#### Returns

`Promise`\<`void`\>

***

### openSidebarMenu()

```ts
openSidebarMenu(menu): Promise<void>
```

Opens a given menu in the sidebar.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `menu` | `SettingsSidebarMenus` | The menu to open. |

#### Returns

`Promise`\<`void`\>

***

### providePublicEncryptionKey()

```ts
providePublicEncryptionKey(): Promise<void>
```

#### Returns

`Promise`\<`void`\>

***

### rejectNewNetwork()

```ts
rejectNewNetwork(): Promise<void>
```

Rejects a new network request.

#### Returns

`Promise`\<`void`\>

***

### rejectSignature()

```ts
rejectSignature(): Promise<void>
```

Rejects a signature request. This function supports all types of commonly used signatures.

#### Returns

`Promise`\<`void`\>

***

### rejectSwitchNetwork()

```ts
rejectSwitchNetwork(): Promise<void>
```

Rejects a switch network request.

#### Returns

`Promise`\<`void`\>

***

### rejectTokenPermission()

```ts
rejectTokenPermission(): Promise<void>
```

Rejects a permission request to spend tokens.

::: warning
For NFT approvals, use `confirmTransaction` method.
:::

#### Returns

`Promise`\<`void`\>

***

### rejectTransaction()

```ts
rejectTransaction(): Promise<void>
```

Rejects a transaction request.

#### Returns

`Promise`\<`void`\>

***

### resetAccount()

```ts
resetAccount(): Promise<void>
```

Resets the account.

::: warning
This function requires the correct menu to be already opened.
:::

#### Returns

`Promise`\<`void`\>

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

***

### switchNetwork()

```ts
switchNetwork(networkName, isTestnet?): Promise<void>
```

Switches to the network with the given name.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `networkName` | `string` | The name of the network to switch to. |
| `isTestnet`? | `boolean` | If switch to a test network. |

#### Returns

`Promise`\<`void`\>

***

### toggleDismissSecretRecoveryPhraseReminder()

```ts
toggleDismissSecretRecoveryPhraseReminder(): Promise<void>
```

Toggles the "Dismiss Secret Recovery Phrase Reminder" setting.

::: warning
This function requires the correct menu to be already opened.
:::

#### Returns

`Promise`\<`void`\>

***

### toggleShowTestNetworks()

```ts
toggleShowTestNetworks(): Promise<void>
```

Toggles the "Show Test Networks" setting.

::: warning
This function requires the correct menu to be already opened.
:::

#### Returns

`Promise`\<`void`\>

***

### unlock()

```ts
unlock(): Promise<void>
```

Unlocks MetaMask.

#### Returns

`Promise`\<`void`\>

***

### unsafe\_enableEthSign()

```ts
unsafe_enableEthSign(): Promise<void>
```

Enables the eth_sign feature in MetaMask advanced settings.
This method is marked as unsafe because enabling eth_sign can have security implications.

#### Returns

`Promise`\<`void`\>

## Experimental Methods

### closeTransactionDetails()

`Experimental`

```ts
closeTransactionDetails(): Promise<void>
```

Closes the currently opened transaction details.

#### Returns

`Promise`\<`void`\>

***

### confirmTransactionAndWaitForMining()

`Experimental`

```ts
confirmTransactionAndWaitForMining(options?): Promise<void>
```

Confirms a transaction request and waits for the transaction to be mined.
This function utilizes the "Activity" tab of the MetaMask tab.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options`? | `object` | The transaction options. |
| `options.gasSetting`? |  \| `"low"` \| `"market"` \| `"aggressive"` \| `"site"` \| \{ `"gasLimit"`: `number`; `"maxBaseFee"`: `number`; `"priorityFee"`: `number`; \} | The gas setting to use for the transaction. |

#### Returns

`Promise`\<`void`\>

***

### openTransactionDetails()

`Experimental`

```ts
openTransactionDetails(txIndex): Promise<void>
```

Opens the transaction details.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `txIndex` | `number` | The index of the transaction in the "Activity" tab. Starts from `0`. |

#### Returns

`Promise`\<`void`\>

## Selectors

| Property | Modifier | Type | Description |
| :------ | :------ | :------ | :------ |
| `crashPage` | `readonly` | `CrashPage` | This property can be used to access selectors for a given page. |
| `homePage` | `readonly` | `HomePage` | This property can be used to access selectors for a given page. |
| `lockPage` | `readonly` | `LockPage` | This property can be used to access selectors for a given page. |
| `notificationPage` | `readonly` | `NotificationPage` | This property can be used to access selectors for a given page. |
| `onboardingPage` | `readonly` | `OnboardingPage` | This property can be used to access selectors for a given page. |
