import { testWithSynpress } from '@synthetixio/synpress-core'
import { Petra, petraFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(petraFixtures(basicSetup))

const { expect } = test

test('should lock the wallet', async ({ context, petraPage }) => {
  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  await petra.lock()

  await expect(petraPage.locator(petra.unlockPage.selectors.submitButton)).toBeVisible()
})
