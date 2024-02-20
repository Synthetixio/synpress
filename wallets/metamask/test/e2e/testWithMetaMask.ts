import { testWithSynpress } from '@synthetixio/synpress-fixtures'
import { MetaMask, unlockForFixture } from '../../src'

import connectedSetup from './wallet-setup/connected.setup'
import { expect } from '@playwright/test'

export const testWithMetaMask = testWithSynpress(connectedSetup, unlockForFixture).extend<{
  metamask: MetaMask
  connectToAnvil: () => Promise<void>
  deployToken: () => Promise<void>
}>({
  metamask: async ({ context, metamaskPage, extensionId }, use) => {
    const metamask = new MetaMask(context, metamaskPage, connectedSetup.walletPassword, extensionId)

    await use(metamask)
  },
  page: async ({ page }, use) => {
    await page.goto('/')

    await use(page)
  },
  connectToAnvil: async ({ metamask, createAnvilNode }, use) => {
    await use(async () => {
      const { rpcUrl, chainId } = await createAnvilNode({
        chainId: 1338
      })

      await metamask.addNetwork({
        name: 'Anvil',
        rpcUrl,
        chainId,
        symbol: 'ETH',
        blockExplorerUrl: 'https://etherscan.io/'
      })
    })
  },
  deployToken: async ({ page, metamask, connectToAnvil }, use) => {
    await use(async () => {
      await connectToAnvil()

      await expect(page.locator('#tokenAddresses')).toBeEmpty()
      await page.locator('#createToken').click()

      await metamask.confirmTransaction()
    })
  }
})
