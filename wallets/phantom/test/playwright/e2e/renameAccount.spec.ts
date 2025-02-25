import { testWithSynpress } from '@synthetixio/synpress-core'
import { Phantom, phantomFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(phantomFixtures(basicSetup))

const { expect } = test

test('should rename current account with specified name', async ({ context, phantomPage }) => {
  test.setTimeout(80_000)

  const phantom = new Phantom(context, phantomPage, basicSetup.walletPassword)

  const accountName = 'Test Account'
  await phantom.renameAccount('Account 1', accountName)

  await phantomPage.reload()

  await expect(phantomPage.locator(phantom.homePage.selectors.accountMenu.accountName)).toHaveText(accountName)
})
