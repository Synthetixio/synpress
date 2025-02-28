import { testWithSynpress } from '@synthetixio/synpress-core'
import { Phantom, phantomFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(phantomFixtures(basicSetup))

const { expect } = test

test('should go back to the home page', async ({ context, phantomPage }) => {
  const phantom = new Phantom(context, phantomPage, basicSetup.walletPassword)

  await expect(phantomPage.locator(phantom.homePage.selectors.settings.lockWallet)).not.toBeVisible()

  await phantom.openSettings()

  await expect(phantomPage.locator(phantom.homePage.selectors.settings.lockWallet)).toBeVisible()

  await phantom.goBackToHomePage()

  await expect(phantomPage.locator(phantom.homePage.selectors.settings.lockWallet)).not.toBeVisible()
})
