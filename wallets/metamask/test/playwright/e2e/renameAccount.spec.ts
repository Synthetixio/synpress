import { testWithSynpress } from '@synthetixio/synpress-core'
import { MetaMask, metaMaskFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(metaMaskFixtures(basicSetup))

const { expect } = test

test('should rename current account with specified name', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  const accountName = 'Test Account'
  await metamask.renameAccount('Account 1', accountName)

  await expect(metamaskPage.locator(metamask.homePage.selectors.accountMenu.accountButton)).toHaveText(accountName)
})
