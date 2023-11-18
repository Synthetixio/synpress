import { testWithSynpress } from 'fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { expect } = test

test('should go back to the home page', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await metamask.openSettings()

  await expect(metamaskPage.locator(metamask.homePage.selectors.account)).not.toBeVisible()

  await metamask.goBackToHomePage()

  await expect(metamaskPage.locator(metamask.homePage.selectors.account)).toBeVisible()
})
