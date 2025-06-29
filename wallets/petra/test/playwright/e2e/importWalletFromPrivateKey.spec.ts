import { testWithSynpress } from '@synthetixio/synpress-core'
import { Petra, petraFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(petraFixtures(basicSetup))

const { expect } = test

const privateKey = 'ea084c575a01e2bbefcca3db101eaeab1d8af15554640a510c73692db24d0a6a'

test('should import a new wallet from private key', async ({ context, petraPage }) => {
  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  await petra.importWalletFromPrivateKey('aptos', privateKey)

  await petraPage.locator(petra.homePage.selectors.accountMenu.accountName).hover()
  await expect(petraPage.locator(petra.homePage.selectors.ethereumWalletAddress)).toContainText('0xa2ce...6801')
})

// Flaky test - To be improved
test.skip('should throw an error if trying to import private key for the 2nd time', async ({ context, petraPage }) => {
  const phantom = new Petra(context, petraPage, basicSetup.walletPassword)

  await phantom.importWalletFromPrivateKey('aptos', privateKey)

  // To avoid random fails
  await petraPage.waitForTimeout(2_000)

  const importWalletPromise = phantom.importWalletFromPrivateKey('aptos', privateKey)

  await expect(importWalletPromise).rejects.toThrowError(
    '[ImportWalletFromPrivateKey] Importing failed due to error: This account already exists in your wallet'
  )
})

test('should throw an error if the private key is invalid', async ({ context, petraPage }) => {
  const phantom = new Petra(context, petraPage, basicSetup.walletPassword)

  const importWalletPromise = phantom.importWalletFromPrivateKey('aptos', '0xdeadbeef')

  await expect(importWalletPromise).rejects.toThrowError(
    '[ImportWalletFromPrivateKey] Importing failed due to error: Incorrect format'
  )
})
