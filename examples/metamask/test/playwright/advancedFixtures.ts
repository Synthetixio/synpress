import { metaMaskFixtures } from '@synthetixio/synpress/playwright'
import connectedSetup from '../wallet-setup/connected.setup'

export const test = metaMaskFixtures(connectedSetup).extend<{
  deployToken: () => Promise<void>
  deployPiggyBank: () => Promise<void>
}>({
  deployToken: async ({ page, metamask }, use) => {
    await use(async () => {
      // We want to make sure we are connected to the local Anvil node.
      await expect(page.locator('#network')).toHaveText('0x53a')

      await expect(page.locator('#tokenAddresses')).toBeEmpty()
      await page.locator('#createToken').click()

      await metamask.confirmTransaction()
    })
  },
  deployPiggyBank: async ({ page, metamask }, use) => {
    await use(async () => {
      // We want to make sure we are connected to the local Anvil node.
      await expect(page.locator('#network')).toHaveText('0x53a')

      await expect(page.locator('#contractStatus')).toHaveText('Not clicked')

      await page.locator('#deployButton').click()
      await metamask.confirmTransaction()

      await expect(page.locator('#contractStatus')).toHaveText('Deployed')
    })
  }
})

export const { expect, describe } = test
