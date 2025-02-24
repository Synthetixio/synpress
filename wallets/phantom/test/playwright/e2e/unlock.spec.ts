import { testWithSynpress } from '@synthetixio/synpress-core'
import { Phantom, phantomFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(phantomFixtures(basicSetup))

const { expect } = test

test('should unlock the wallet', async ({ context, phantomPage }) => {
  const phantom = new Phantom(context, phantomPage, basicSetup.walletPassword)

  await phantom.lock()

  await phantom.unlock()

  await expect(phantomPage.locator(phantom.homePage.selectors.accountMenu.accountName)).toContainText('Account')
})
