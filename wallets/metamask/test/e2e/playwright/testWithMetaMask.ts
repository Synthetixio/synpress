import { testWithSynpress } from '@synthetixio/synpress-fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import { expect } from '@playwright/test'
import connectedSetup from './wallet-setup/connected.setup'

export const testWithMetaMask = testWithSynpress(connectedSetup, unlockForFixture).extend<{
  metamask: MetaMask
  connectToAnvil: () => Promise<void>
  deployToken: () => Promise<void>
  deployAndMintERC1155: () => Promise<void>
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
  },
  deployAndMintERC1155: async ({ page, metamask, connectToAnvil }, use) => {
    await use(async () => {
      await connectToAnvil()

      await page.locator('#deployERC1155Button').click()
      await metamask.confirmTransaction()

      await page.locator('#batchMintButton').click()
      await metamask.confirmTransactionAndWaitForMining()

      await expect(page.locator('#erc1155Status')).toHaveText('Batch Minting completed')
    })
  }
})
