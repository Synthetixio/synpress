import { testWithSynpress } from '@synthetixio/synpress-core'
import { Petra, petraFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(petraFixtures(basicSetup))

const { expect } = test

test('should switch account', async ({ context, petraPage }) => {
  test.setTimeout(90_000)

  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  await petra.importWalletFromPrivateKey(
    'aptos',
    'ea084c575a01e2bbefcca3db101eaeab1d8af15554640a510c73692db24d0a6a',
    'Imp1'
  )
  await expect(petraPage.getByTestId('home-header-account-name')).toContainText('Imp1')

  await petra.importWalletFromPrivateKey(
    'aptos',
    '7dd4aab86170c0edbdcf97600eff0ae319fdc94149c5e8c33d5439f8417a40bf',
    'Imp2'
  )
  await expect(petraPage.getByTestId('home-header-account-name')).toContainText('Imp2')

  await petra.switchAccount('Imp1')

  await expect(petraPage.getByTestId('home-header-account-name')).toContainText('Imp1')

  await petraPage.locator(petra.homePage.selectors.accountMenu.accountName).hover()
  await expect(petraPage.locator(petra.homePage.selectors.ethereumWalletAddress)).toContainText('0xa2ce...6801')
})

test('should throw an error if there is no account with target name', async ({ context, petraPage }) => {
  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  const accountName = 'Account 420'
  const switchAccountPromise = petra.switchAccount(accountName)

  await expect(switchAccountPromise).rejects.toThrowError(`[SwitchAccount] Account with name ${accountName} not found`)
})
