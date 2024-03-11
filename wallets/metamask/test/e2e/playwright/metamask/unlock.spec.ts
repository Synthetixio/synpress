import { testWithSynpress } from '@synthetixio/synpress-fixtures'
import { MetaMask, unlockForFixture } from '../../../../src'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { expect } = test

test('should unlock the wallet', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await metamask.lock()

  await metamask.unlock()

  await expect(metamaskPage.locator(metamask.homePage.selectors.logo)).toBeVisible()
})
