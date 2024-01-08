# testWithSynpress()

```ts
testWithSynpress(
   walletSetup, 
   unlockWallet, 
slowMo?): TestType<PlaywrightTestArgs & PlaywrightTestOptions & PublicSynpressFixtures, PlaywrightWorkerArgs & PlaywrightWorkerOptions>
```

The factory function for the `test` fixture from Playwright extended with Synpress fixtures.

## Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `walletSetup` | \{   `fn`: `WalletSetupFunction`;   `hash`: `string`;   `walletPassword`: `string`;   } | An object returned from the `defineWalletSetup` function. |
| `walletSetup.fn` | `WalletSetupFunction` | The wallet setup function itself. |
| `walletSetup.hash` | `string` | Hash of the cached wallet setup function. |
| `walletSetup.walletPassword`? | `string` | The password of the wallet. |
| `unlockWallet`? | `UnlockWalletFunction` | A function that unlocks the wallet. |
| `slowMo`? | `number` | Slows down Playwright operations by the specified amount of milliseconds. Useful so that you can see what is going on. Defaults to `0`. |

## Returns

`TestType`\<`PlaywrightTestArgs` & `PlaywrightTestOptions` & `PublicSynpressFixtures`, `PlaywrightWorkerArgs` & `PlaywrightWorkerOptions`\>

The `test` fixture from Playwright extended with Synpress fixtures. See: https://playwright.dev/docs/api/class-test#test-call.
