import { testWithSynpress } from '@synthetixio/synpress-core'
import { Phantom, phantomFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(phantomFixtures(basicSetup))

const { expect } = test

test('should rename current account with specified name', async ({ context, phantomPage }) => {
  test.setTimeout(100_000)

  const phantom = new Phantom(context, phantomPage, basicSetup.walletPassword)

  await phantom.importWalletFromPrivateKey(
    'ethereum',
    'ea084c575a01e2bbefcca3db101eaeab1d8af15554640a510c73692db24d0a6a',
    'Imp1'
  )

  const accountName = 'Test Account'
  await phantom.renameAccount('Imp1', accountName)

  await phantomPage.reload()

  await expect(phantomPage.locator(phantom.homePage.selectors.accountMenu.accountName)).toHaveText(accountName)
})
