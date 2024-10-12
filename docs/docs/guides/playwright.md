# Playwright

Integrating Synpress into Playwright is quite straightforward.

Let's digest a simple test step by step:

::: code-group
```typescript [example.spec.ts]
import { MetaMask, testWithSynpress, unlockForFixture } from '@synthetixio/synpress'
import BasicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(BasicSetup, unlockForFixture)

const { expect } = test

test('should connect wallet to the MetaMask Test Dapp', async ({ context, page, extensionId }) => {
  const metamask = new MetaMask(context, page, BasicSetup.walletPassword, extensionId)

  await page.goto('/')

  await page.locator('#connectButton').click()
  await metamask.connectToDapp()
  await expect(page.locator('#accounts')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')

  await page.locator('#getAccounts').click()
  await expect(page.locator('#getAccountsResult')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
})
```
:::

## Import

First, you need to import the `testWithSynpress` function from `@synthetixio/synpress` and use it to define your `test` function that you'd typically import directly from Playwright:

```typescript
import { MetaMask, testWithSynpress, unlockForFixture } from '@synthetixio/synpress'
import BasicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(BasicSetup, unlockForFixture)
```

The first argument of the `testWithSynpress` function is the wallet setup function you want to use in this test file.

The second argument is a function that will be used to unlock the wallet before each test. Currently, you have to pass the `unlockForFixture` function from `@synthetixio/synpress` which unlocks the MetaMask wallet, but soon you'll be able to pass here unlock functions from other wallets!

## Define your test

Now that you have access to the `test` function that you'd typically import from Playwright, you can use it to define your test:

```typescript
const { expect } = test

test('should connect wallet to the MetaMask Test Dapp', async ({ context, page, extensionId }) => {
  const metamask = new MetaMask(context, page, BasicSetup.walletPassword, extensionId)

  await page.goto('/')

  await page.locator('#connectButton').click()
  await metamask.connectToDapp()
  await expect(page.locator('#accounts')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')

  await page.locator('#getAccounts').click()
  await expect(page.locator('#getAccountsResult')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
})
```

You can notice the unusual `extensionId` fixture used here. This fixture is amongst a few others that are provided by Synpress. You can learn more about them in the [Built-in Fixtures](./fixtures) section.

To access the MetaMask API, you must create an instance of the `MetaMask` class as shown above. To learn more about the constructor and all the methods this class provides, see [its API reference](/api/playwright/classes/MetaMask.md).

::: tip

If you're using the same wallet setup in multiple test files, you can speed up the process of writing your tests by defining a custom fixture that will create the `MetaMask` instance for you.

::: details 💡 Click here to see how to do it

1. Define the custom fixture in a separate file by extending the `testWithSynpress` function.
2. Use this new instance in your test file.

See the code below:

::: code-group

```typescript [testWithMetaMask.ts]
import { testWithSynpress, MetaMask, unlockForFixture } from '@synthetixio/synpress'

import connectedSetup from './wallet-setup/connected.setup'

export const testWithMetaMask = testWithSynpress(connectedSetup, unlockForFixture).extend<{
  metamask: MetaMask
}>({
  metamask: async ({ context, metamaskPage, extensionId }, use) => {
    const metamask = new MetaMask(context, metamaskPage, connectedSetup.walletPassword, extensionId)

    await use(metamask)
  }
})
```

```typescript [basic.spec.ts]
import {testWithMetaMask as test} from './testWithMetaMask'

const { expect } = test

// The `MetaMask` instance is now available in the test context.
test('should connect wallet to dapp', async ({ context, page, extensionId, metamask }) => {
  await page.goto('/')

  await page.locator('#connectButton').click()
  
  await metamask.connectToDapp()

  await expect(page.locator('#accounts')).toHaveText('0xdeadbeef')
})
```
```typescript [basic.spec.ts]
import { testWithMetaMask as test } from './testWithMetaMask';

const { expect } = test;

// The `MetaMask` instance is now available in the test context.
test('should connect multiple wallets to dapp', async ({ context, page, extensionId, metamask }) => {
  await page.goto('/');

  await page.locator('#connectButton').click();

  await metamask.connectToDapp(['0xdeadbeef1', '0xdeadbeef2']);

  await expect(page.locator('#accounts')).toHaveText('0xdeadbeef1,0xdeadbeef2');

});
```

:::

## Run the test

Now that you have your test defined, you can run it as you would typically do with Playwright:

```bash
playwright test
```

::: warning NOTE
In the current stage of Synpress development, the `playwright test` command will behave differently than you might expect, i.e., it will run in the headed mode by default, similarly to `playwright test --headed`.

To run your tests in the headless mode, you need to use the `HEADLESS` environmental variable:

```bash
HEADLESS=true playwrighe test
```

This behavior will be changed in the future to resemble Playwright's default behavior.
:::

::: tip
Synpress now supports **all** features of Playwright, including [Parallelism](https://playwright.dev/docs/test-parallel) and [UI Mode](https://playwright.dev/docs/test-ui-mode)!
:::
