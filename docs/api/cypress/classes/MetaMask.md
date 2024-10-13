# Class: MetaMask

MetaMask class for interacting with the MetaMask extension in Cypress tests.

## Constructors

### new MetaMask()

```ts
new MetaMask(
   context, 
   metamaskExtensionPage, 
   metamaskExtensionId): MetaMask
```

Creates an instance of MetaMask.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `context` | `BrowserContext` | The browser context |
| `metamaskExtensionPage` | `Page` | The MetaMask extension page |
| `metamaskExtensionId` | `string` | The MetaMask extension ID |

#### Returns

[`MetaMask`](MetaMask.md)

## Properties

| Property | Modifier | Type | Description |
| :------ | :------ | :------ | :------ |
| `metamaskExtensionPage` | `readonly` | `Page` | The MetaMask extension page |
| `metamaskPlaywright` | `readonly` | [`MetaMask`](../../playwright/classes/MetaMask.md) | The MetaMask instance for Playwright |

## Methods

### addNetwork()

```ts
addNetwork(network): Promise<boolean>
```

Adds a new network to MetaMask.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `network` | `object` | The network configuration to add |
| `network.blockExplorerUrl`? | `string` | - |
| `network.chainId` | `number` | - |
| `network.name` | `string` | - |
| `network.rpcUrl` | `string` | - |
| `network.symbol` | `string` | - |

#### Returns

`Promise`\<`boolean`\>

True if the network was added successfully

***

### addNewAccount()

```ts
addNewAccount(accountName): Promise<boolean>
```

Adds a new account with the given name.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `accountName` | `string` | The name for the new account |

#### Returns

`Promise`\<`boolean`\>

True if the account was added successfully

***

### addNewToken()

```ts
addNewToken(): Promise<boolean>
```

Adds a new token to MetaMask.

#### Returns

`Promise`\<`boolean`\>

True if the token was added successfully

***

### approveNewNetwork()

```ts
approveNewNetwork(): Promise<boolean>
```

Approves adding a new network.

#### Returns

`Promise`\<`boolean`\>

True if the new network was approved successfully

***

### approveSwitchNetwork()

```ts
approveSwitchNetwork(): Promise<boolean>
```

Approves switching to a new network.

#### Returns

`Promise`\<`boolean`\>

True if the network switch was approved successfully

***

### approveTokenPermission()

```ts
approveTokenPermission(options?): Promise<boolean>
```

Approves token permission.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options`? | `object` | Optional settings for token approval |
| `options.gasSetting`? |  \| `"low"` \| `"market"` \| `"aggressive"` \| `"site"` \| \{ `"gasLimit"`: `number`; `"maxBaseFee"`: `number`; `"priorityFee"`: `number`; \} | Gas settings for the transaction |
| `options.spendLimit`? | `number` \| `"max"` | The spend limit for the token (number or 'max') |

#### Returns

`Promise`\<`boolean`\>

True if the permission was approved, false otherwise

***

### closeTransactionDetails()

```ts
closeTransactionDetails(): Promise<boolean>
```

Closes the transaction details view.

#### Returns

`Promise`\<`boolean`\>

True if the transaction details were closed successfully, false otherwise

***

### confirmSignature()

```ts
confirmSignature(): Promise<boolean>
```

Confirms a signature request.

#### Returns

`Promise`\<`boolean`\>

True if the signature was confirmed successfully, false otherwise

***

### confirmTransaction()

```ts
confirmTransaction(options?): Promise<boolean>
```

Confirms a transaction.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options`? | `object` | Optional gas settings for the transaction |
| `options.gasSetting`? |  \| `"low"` \| `"market"` \| `"aggressive"` \| `"site"` \| \{ `"gasLimit"`: `number`; `"maxBaseFee"`: `number`; `"priorityFee"`: `number`; \} | - |

#### Returns

`Promise`\<`boolean`\>

True if the transaction was confirmed successfully

***

### confirmTransactionAndWaitForMining()

```ts
confirmTransactionAndWaitForMining(): Promise<boolean>
```

Confirms a transaction and waits for it to be mined.

#### Returns

`Promise`\<`boolean`\>

True if the transaction was confirmed and mined successfully, false otherwise

***

### connectToAnvil()

```ts
connectToAnvil(options): Promise<boolean>
```

Connects to an Anvil node.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options` | `object` | Object containing the RPC URL and chain ID |
| `options.chainId` | `number` | The chain ID of the Anvil node |
| `options.rpcUrl` | `string` | The RPC URL of the Anvil node |

#### Returns

`Promise`\<`boolean`\>

True if the connection was successful, false otherwise

***

### connectToDapp()

```ts
connectToDapp(accounts?): Promise<boolean>
```

Connects MetaMask to a dApp.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `accounts`? | `string`[] | Optional array of account addresses to connect |

#### Returns

`Promise`\<`boolean`\>

True if the connection was successful

***

### createAnvilNode()

```ts
createAnvilNode(options?): Promise<{
  "anvil": Anvil;
  "chainId": number;
  "rpcUrl": string;
}>
```

Creates an Anvil node for testing.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options`? | `CreateAnvilOptions` | Optional Anvil node creation options |

#### Returns

`Promise`\<\{
  `"anvil"`: `Anvil`;
  `"chainId"`: `number`;
  `"rpcUrl"`: `string`;
 \}\>

Object containing the Anvil instance, RPC URL, and chain ID

| Member | Type |
| :------ | :------ |
| `anvil` | `Anvil` |
| `chainId` | `number` |
| `rpcUrl` | `string` |

***

### decrypt()

```ts
decrypt(): Promise<boolean>
```

Decrypts a message.

#### Returns

`Promise`\<`boolean`\>

True if the message was decrypted successfully, false otherwise

***

### deployToken()

```ts
deployToken(): Promise<boolean>
```

Deploys a token.

#### Returns

`Promise`\<`boolean`\>

True if the token was deployed successfully

***

### emptyAnvilNode()

```ts
emptyAnvilNode(): Promise<boolean>
```

Empties the Anvil node pool.

#### Returns

`Promise`\<`boolean`\>

True if the operation was successful

***

### getAccount()

```ts
getAccount(): Promise<string>
```

Gets the current account name.

#### Returns

`Promise`\<`string`\>

The current account name

***

### getAccountAddress()

```ts
getAccountAddress(): Promise<string>
```

Gets the current account address.

#### Returns

`Promise`\<`string`\>

The current account address

***

### getNetwork()

```ts
getNetwork(): Promise<string>
```

Gets the current network name.

#### Returns

`Promise`\<`string`\>

The current network name

***

### goBackToHomePage()

```ts
goBackToHomePage(): Promise<boolean>
```

Navigates back to the home page.

#### Returns

`Promise`\<`boolean`\>

True if the navigation was successful

***

### importWallet()

```ts
importWallet(seedPhrase): Promise<boolean>
```

Imports a wallet using a seed phrase.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `seedPhrase` | `string` | The seed phrase to import |

#### Returns

`Promise`\<`boolean`\>

True if the import was successful

***

### importWalletFromPrivateKey()

```ts
importWalletFromPrivateKey(privateKey): Promise<boolean>
```

Imports a wallet using a private key.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `string` | The private key to import |

#### Returns

`Promise`\<`boolean`\>

True if the import was successful

***

### lock()

```ts
lock(): Promise<boolean>
```

Locks the MetaMask wallet.

#### Returns

`Promise`\<`boolean`\>

True if the wallet was locked successfully

***

### openSettings()

```ts
openSettings(): Promise<boolean>
```

Opens the settings page.

#### Returns

`Promise`\<`boolean`\>

True if the settings page was opened successfully

***

### openSidebarMenu()

```ts
openSidebarMenu(menu): Promise<boolean>
```

Opens a specific sidebar menu in the settings.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `menu` | `SettingsSidebarMenus` | The menu to open |

#### Returns

`Promise`\<`boolean`\>

True if the menu was opened successfully

***

### openTransactionDetails()

```ts
openTransactionDetails(txIndex): Promise<boolean>
```

Opens the details of a specific transaction.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `txIndex` | `number` | The index of the transaction to open |

#### Returns

`Promise`\<`boolean`\>

True if the transaction details were opened successfully, false otherwise

***

### providePublicEncryptionKey()

```ts
providePublicEncryptionKey(): Promise<boolean>
```

Provides a public encryption key.

#### Returns

`Promise`\<`boolean`\>

True if the key was provided successfully, false otherwise

***

### rejectNewNetwork()

```ts
rejectNewNetwork(): Promise<boolean>
```

Rejects adding a new network.

#### Returns

`Promise`\<`boolean`\>

True if the new network was rejected successfully

***

### rejectSignature()

```ts
rejectSignature(): Promise<boolean>
```

Rejects a signature request.

#### Returns

`Promise`\<`boolean`\>

True if the signature was rejected successfully

***

### rejectSwitchNetwork()

```ts
rejectSwitchNetwork(): Promise<boolean>
```

Rejects switching to a new network.

#### Returns

`Promise`\<`boolean`\>

True if the network switch was rejected successfully

***

### rejectTokenPermission()

```ts
rejectTokenPermission(): Promise<boolean>
```

Rejects token permission.

#### Returns

`Promise`\<`boolean`\>

True if the permission was rejected successfully

***

### rejectTransaction()

```ts
rejectTransaction(): Promise<boolean>
```

Rejects a transaction.

#### Returns

`Promise`\<`boolean`\>

True if the transaction was rejected successfully

***

### renameAccount()

```ts
renameAccount(options): Promise<boolean>
```

Renames an account.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options` | `object` | Object containing the current and new account names |
| `options.currentAccountName` | `string` | The current name of the account |
| `options.newAccountName` | `string` | The new name for the account |

#### Returns

`Promise`\<`boolean`\>

True if the rename was successful

***

### resetAccount()

```ts
resetAccount(): Promise<boolean>
```

Resets the current account.

#### Returns

`Promise`\<`boolean`\>

True if the reset was successful

***

### switchAccount()

```ts
switchAccount(accountName): Promise<boolean>
```

Switches to the account with the given name.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `accountName` | `string` | The name of the account to switch to |

#### Returns

`Promise`\<`boolean`\>

True if the switch was successful

***

### switchNetwork()

```ts
switchNetwork(options): Promise<boolean>
```

Switches to the specified network.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options` | `object` | Object containing the network name and testnet flag |
| `options.isTestnet`? | `boolean` | Whether the network is a testnet (default: false) |
| `options.networkName` | `string` | The name of the network to switch to |

#### Returns

`Promise`\<`boolean`\>

True if the switch was successful, false otherwise

***

### toggleDismissSecretRecoveryPhraseReminder()

```ts
toggleDismissSecretRecoveryPhraseReminder(): Promise<boolean>
```

Toggles the dismissal of the secret recovery phrase reminder.

#### Returns

`Promise`\<`boolean`\>

True if the toggle was successful

***

### toggleShowTestNetworks()

```ts
toggleShowTestNetworks(): Promise<boolean>
```

Toggles the display of test networks.

#### Returns

`Promise`\<`boolean`\>

True if the toggle was successful

***

### unlock()

```ts
unlock(): Promise<boolean>
```

Unlocks the MetaMask wallet.

#### Returns

`Promise`\<`boolean`\>

True if the wallet was unlocked successfully
