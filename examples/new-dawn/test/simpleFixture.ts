import { MetaMask, testWithSynpress, unlockForFixture } from '@synthetixio/synpress'
import ConnectedSetup from './wallet-setup/connected.setup'

/**
 * We're creating a fixture that will serve as a foundation for tests in the `02_simple.spec.ts` file.
 *
 * You can read more about Playwright fixtures here: https://playwright.dev/docs/test-fixtures
 */
export const test = testWithSynpress(ConnectedSetup, unlockForFixture).extend<{
  metamask: MetaMask
  connectToAnvil: () => Promise<void>
}>({
  metamask: async ({ context, metamaskPage, extensionId }, use) => {
    const metamask = new MetaMask(context, metamaskPage, ConnectedSetup.walletPassword, extensionId)

    await use(metamask)
  },
  page: async ({ page }, use) => {
    /**
     * Refers to the home page of the locally hosted MetaMask Test Dapp.
     *
     * See: https://playwright.dev/docs/api/class-testoptions#test-options-base-url
     */
    await page.goto('/')

    await use(page)
  },
  connectToAnvil: async ({ metamask, createAnvilNode }, use) => {
    await use(async () => {
      const { rpcUrl, chainId } = await createAnvilNode({
        chainId: 1338
      })

      await metamask.addNetwork({
        name: 'Local Anvil Network',
        rpcUrl,
        chainId,
        symbol: 'ETH'
      })
    })
  }
})

export const { expect } = test
