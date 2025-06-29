import { testWithSynpress } from '@synthetixio/synpress-core'
import { Petra, petraFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(petraFixtures(basicSetup))

const { expect } = test

test('should go back to the home page', async ({ context, petraPage }) => {
  const phantom = new Petra(context, petraPage, basicSetup.walletPassword)

  await expect(petraPage.locator(phantom.homePage.selectors.settings.lockWallet)).not.toBeVisible()

  await phantom.openSettings()

  await expect(petraPage.locator(phantom.homePage.selectors.settings.lockWallet)).toBeVisible()

  await phantom.goBackToHomePage()

  await expect(petraPage.locator(phantom.homePage.selectors.settings.lockWallet)).not.toBeVisible()
})
