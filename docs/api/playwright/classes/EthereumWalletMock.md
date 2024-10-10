# Class: EthereumWalletMock

Mock implementation of an Ethereum wallet for testing purposes.
Simulates wallet behavior in a controlled environment, allowing for consistent
and reproducible tests without relying on actual blockchain interactions.

## Extends

- `EthereumWalletMockAbstract`

## Constructors

### new EthereumWalletMock()

```ts
new EthereumWalletMock(page, wallet?): EthereumWalletMock
```

Creates an instance of EthereumWalletMock.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `page` | `Page` | The Playwright Page object to interact with. |
| `wallet`? | `WalletMock` | The type of wallet to mock. |

#### Returns

[`EthereumWalletMock`](EthereumWalletMock.md)

#### Overrides

`EthereumWalletMockAbstract.constructor`

## Properties

| Property | Type | Description | Inherited from |
| :------ | :------ | :------ | :------ |
| `page` | `Page` | The Playwright Page object to interact with. | - |
| `seedPhrase` | `undefined` \| `string` | - | `EthereumWalletMockAbstract.seedPhrase` |
| `wallet` | `WalletMock` | - | `EthereumWalletMockAbstract.wallet` |

## Methods

### addNetwork()

```ts
addNetwork(network): Promise<void>
```

Adds a new network.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `network` | `Network` | The network object to use for adding the new network. |

#### Returns

`Promise`\<`void`\>

A promise that resolves when the network is added.

#### Overrides

`EthereumWalletMockAbstract.addNetwork`

***

### addNewAccount()

```ts
addNewAccount(): Promise<void>
```

Adds a new account based on the initially imported seed phrase.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the new account is added.

#### Overrides

`EthereumWalletMockAbstract.addNewAccount`

***

### connectToDapp()

```ts
connectToDapp(wallet?): Promise<void>
```

Connects wallet to the dapp.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `wallet`? | `WalletMock` | The wallet to connect to the dapp. |

#### Returns

`Promise`\<`void`\>

A promise that resolves when the wallet is connected to the dapp.

#### Overrides

`EthereumWalletMockAbstract.connectToDapp`

***

### getAccountAddress()

```ts
getAccountAddress(): Promise<undefined | `0x${string}`>
```

Retrieves the current account address.

#### Returns

`Promise`\<`undefined` \| \`0x$\{string\}\`\>

A promise that resolves to the current account address.

#### Overrides

`EthereumWalletMockAbstract.getAccountAddress`

***

### getAllAccounts()

```ts
getAllAccounts(): Promise<undefined | `0x${string}`[]>
```

Retrieves all account addresses.

#### Returns

`Promise`\<`undefined` \| \`0x$\{string\}\`[]\>

A promise that resolves to an array of account addresses.

#### Overrides

`EthereumWalletMockAbstract.getAllAccounts`

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

A promise that resolves when the wallet is imported.

#### Overrides

`EthereumWalletMockAbstract.importWallet`

***

### importWalletFromPrivateKey()

```ts
importWalletFromPrivateKey(privateKey): Promise<void>
```

Imports a wallet using the given private key.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | \`0x$\{string\}\` | The private key to import. |

#### Returns

`Promise`\<`void`\>

A promise that resolves when the wallet is imported.

#### Overrides

`EthereumWalletMockAbstract.importWalletFromPrivateKey`

***

### switchAccount()

```ts
switchAccount(accountAddress): Promise<void>
```

Switches to the account with the given address.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `accountAddress` | `string` | The address of the account to switch to. |

#### Returns

`Promise`\<`void`\>

A promise that resolves when the account switch is complete.

#### Overrides

`EthereumWalletMockAbstract.switchAccount`

***

### switchNetwork()

```ts
switchNetwork(networkName): Promise<void>
```

Switches to the network with the given name.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `networkName` | `string` | The name of the network to switch to. |

#### Returns

`Promise`\<`void`\>

A promise that resolves when the network switch is complete.

#### Overrides

`EthereumWalletMockAbstract.switchNetwork`
