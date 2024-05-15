# Function: metaMaskFixtures()

```ts
function metaMaskFixtures(walletSetup, slowMo?): TestType<PlaywrightTestArgs & PlaywrightTestOptions & MetaMaskFixtures, PlaywrightWorkerArgs & PlaywrightWorkerOptions>
```

## Parameters

| Parameter | Type |
| :------ | :------ |
| `walletSetup` | `object` |
| `walletSetup.fn` | `WalletSetupFunction` |
| `walletSetup.hash`? | `string` |
| `walletSetup.walletPassword`? | `string` |
| `slowMo`? | `number` |

## Returns

`TestType`\<`PlaywrightTestArgs` & `PlaywrightTestOptions` & `MetaMaskFixtures`, `PlaywrightWorkerArgs` & `PlaywrightWorkerOptions`\>
