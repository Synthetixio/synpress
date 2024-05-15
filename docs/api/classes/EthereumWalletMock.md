# Class: EthereumWalletMock

## Constructors

### new EthereumWalletMock()

```ts
new EthereumWalletMock(page): EthereumWalletMock
```

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `page` | `Page` |

#### Returns

[`EthereumWalletMock`](EthereumWalletMock.md)

## Properties

| Property | Modifier | Type |
| :------ | :------ | :------ |
| `page` | `readonly` | `Page` |
| `seedPhrase` | `public` | `string` |
| `wallet` | `public` | `WalletMock` |

## Methods

### addNetwork()

```ts
addNetwork(network): Promise<any>
```

Adds a new network.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `network` | `Network` | The network object to use for adding the new network. |

#### Returns

`Promise`\<`any`\>

***

### addNewAccount()

```ts
addNewAccount(): Promise<any>
```

Adds a new account. This account is based on the initially imported seed phrase.

#### Returns

`Promise`\<`any`\>

***

### connectToDapp()

```ts
connectToDapp(wallet?): Promise<any>
```

Connects wallet to the dapp.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `wallet`? | `WalletMock` | The wallet to connect to the dapp. |

#### Returns

`Promise`\<`any`\>

***

### getAccountAddress()

```ts
getAccountAddress(): Promise<undefined | string>
```

Retrieves the current account address.

#### Returns

`Promise`\<`undefined` \| `string`\>

***

### getAllAccounts()

```ts
getAllAccounts(): Promise<string[]>
```

Retrieves the current account address.

#### Returns

`Promise`\<`string`[]\>

***

### importWallet()

```ts
importWallet(seedPhrase): Promise<any>
```

Imports a wallet using the given seed phrase.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `seedPhrase` | `string` | The seed phrase to import. |

#### Returns

`Promise`\<`any`\>

***

### importWalletFromPrivateKey()

```ts
importWalletFromPrivateKey(privateKey): Promise<any>
```

Imports a wallet using the given private key.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | \`0x$\{string\}\` | The private key to import. |

#### Returns

`Promise`\<`any`\>

***

### switchAccount()

```ts
switchAccount(accountAddress): Promise<any>
```

Switches to the account with the given name.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `accountAddress` | `string` | The name of the account to switch to. |

#### Returns

`Promise`\<`any`\>

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
