# Function: defineWalletSetup()

```ts
function defineWalletSetup(walletPassword, fn): {
  "fn": WalletSetupFunction;
  "hash": string;
  "walletPassword": string;
}
```

This function is used to define how a wallet should be set up.
Based on the contents of this function, a browser with the wallet extension is set up and cached so that it can be used by the tests later.

## Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `walletPassword` | `string` | The password of the wallet. |
| `fn` | `WalletSetupFunction` | A function describing the setup of the wallet. |

## Returns

```ts
{
  "fn": WalletSetupFunction;
  "hash": string;
  "walletPassword": string;
}
```

An object containing the hash of the function, the function itself, and the wallet password. The `testWithWalletSetup` function uses this object.

| Member | Type |
| :------ | :------ |
| `fn` | `WalletSetupFunction` |
| `hash` | `string` |
| `walletPassword` | `string` |
