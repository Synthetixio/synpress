import { testWithSynpress } from '@synthetixio/synpress-core'
import { Phantom, phantomFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(phantomFixtures(basicSetup))

const { expect } = test

test('should switch account', async ({ context, phantomPage }) => {
  test.setTimeout(90_000)

  const phantom = new Phantom(context, phantomPage, basicSetup.walletPassword)

  await phantom.importWalletFromPrivateKey(
    'ethereum',
    'ea084c575a01e2bbefcca3db101eaeab1d8af15554640a510c73692db24d0a6a',
    'Imp1'
  )
  await expect(phantomPage.getByTestId('home-header-account-name')).toContainText('Imp1')

  await phantom.importWalletFromPrivateKey(
    'ethereum',
    '7dd4aab86170c0edbdcf97600eff0ae319fdc94149c5e8c33d5439f8417a40bf',
    'Imp2'
  )
  await expect(phantomPage.getByTestId('home-header-account-name')).toContainText('Imp2')

  await phantom.switchAccount('Imp1')

  await expect(phantomPage.getByTestId('home-header-account-name')).toContainText('Imp1')

  await phantomPage.locator(phantom.homePage.selectors.accountMenu.accountName).hover()
  await expect(phantomPage.locator(phantom.homePage.selectors.ethereumWalletAddress)).toContainText('0xa2ce...6801')
})

test('should throw an error if there is no account with target name', async ({ context, phantomPage }) => {
  const phantom = new Phantom(context, phantomPage, basicSetup.walletPassword)

  const accountName = 'Account 420'
  const switchAccountPromise = phantom.switchAccount(accountName)

  await expect(switchAccountPromise).rejects.toThrowError(`[SwitchAccount] Account with name ${accountName} not found`)
})
