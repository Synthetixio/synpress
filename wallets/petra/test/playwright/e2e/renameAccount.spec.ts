import { testWithSynpress } from '@synthetixio/synpress-core'
import { Petra, petraFixtures } from '../../../src/playwright'
import basicSetup from '../wallet-setup/basic.setup'
import { petraPrivateKeyTwo } from '../../constants'

const test = testWithSynpress(petraFixtures(basicSetup))

const { expect } = test

test('should rename current account with specified name', async ({ context, petraPage }) => {
  test.setTimeout(10_000)

  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  await petra.importWalletFromPrivateKey(petraPrivateKeyTwo)

  const accountName = 'Main Account'
  await petra.renameAccount(accountName)
  await petraPage.reload()

  await expect(petraPage.locator(petra.homePage.selectors.accountMenu.accountName)).toHaveText(accountName)
})
