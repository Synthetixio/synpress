import { testWithSynpress } from '@synthetixio/synpress-core'
import { Petra, petraFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(petraFixtures(basicSetup))

const { expect } = test

test('should unlock the wallet', async ({ context, petraPage }) => {
  const phantom = new Petra(context, petraPage, basicSetup.walletPassword)

  await phantom.lock()

  await phantom.unlock()

  await expect(petraPage.locator(phantom.homePage.selectors.accountMenu.accountName)).toContainText('Account')
})
