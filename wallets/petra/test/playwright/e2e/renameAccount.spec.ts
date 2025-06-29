import { testWithSynpress } from '@synthetixio/synpress-core'
import { Petra, petraFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(petraFixtures(basicSetup))

const { expect } = test

test('should rename current account with specified name', async ({ context, petraPage }) => {
  test.setTimeout(100_000)

  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  await petra.importWalletFromPrivateKey(
    'aptos',
    'ea084c575a01e2bbefcca3db101eaeab1d8af15554640a510c73692db24d0a6a',
    'Imp1'
  )

  const accountName = 'Test Account'
  await petra.renameAccount('Imp1', accountName)

  await petraPage.reload()

  await expect(petraPage.locator(petra.homePage.selectors.accountMenu.accountName)).toHaveText(accountName)
})
