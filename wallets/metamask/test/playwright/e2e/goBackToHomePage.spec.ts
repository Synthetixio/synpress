import { testWithSynpress } from '@synthetixio/synpress-core'
import { MetaMask, metaMaskFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(metaMaskFixtures(basicSetup))

const { expect } = test

test('should go back to the home page', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await metamask.openSettings()

  await expect(metamaskPage.locator(metamask.homePage.selectors.copyAccountAddressButton)).not.toBeVisible()

  await metamask.goBackToHomePage()

  await expect(metamaskPage.locator(metamask.homePage.selectors.copyAccountAddressButton)).toBeVisible()
})
