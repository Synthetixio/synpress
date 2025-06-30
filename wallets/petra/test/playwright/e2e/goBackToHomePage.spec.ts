import { testWithSynpress } from '@synthetixio/synpress-core'
import { Petra, petraFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(petraFixtures(basicSetup))

const { expect } = test

test('should go back to the home page', async ({ context, petraPage }) => {
  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  await expect(petraPage.locator(petra.homePage.selectors.settings.lockWallet)).not.toBeVisible()

  await petra.openSettings()

  await expect(petraPage.locator(petra.homePage.selectors.settings.lockWallet)).toBeVisible()

  await petra.goBackToHomePage()

  await expect(petraPage.locator(petra.homePage.selectors.settings.lockWallet)).not.toBeVisible()
})
