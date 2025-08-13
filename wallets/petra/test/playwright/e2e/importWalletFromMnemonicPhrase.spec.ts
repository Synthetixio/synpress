import { testWithSynpress } from '@synthetixio/synpress-core'
import { Petra, petraFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'
import { testSeedPhrase } from '../../constants'

const test = testWithSynpress(petraFixtures(basicSetup))

const { expect } = test

test('should import a new wallet from private key', async ({ context, petraPage }) => {
  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  await petra.importWalletFromMnemonicPhrase(testSeedPhrase)

  await expect(petraPage.locator(petra.homePage.selectors.accountMenu.accountName)).toContainText('Account')
})

// Flaky test - To be improved
test('should throw an error if trying to import private key for the 2nd time', async ({ context, petraPage }) => {
  const petra = new Petra(context, petraPage, basicSetup.walletPassword)
  const toastElement = petra.homePage.selectors.toasts

  await petra.importWalletFromMnemonicPhrase(testSeedPhrase)

  // To avoid random fails
  await petraPage.waitForTimeout(1_000)

  // Remove the current visible toast notification
  await petraPage.locator(toastElement).locator('button').click()

  await petra.importWalletFromMnemonicPhrase(testSeedPhrase)

  await expect(petraPage.locator(toastElement)).toContainText(/error importing account/i)
})

test('should display an error if the private key is invalid', async ({ context, petraPage }) => {
  const petra = new Petra(context, petraPage, basicSetup.walletPassword)
  const toastElement = petra.homePage.selectors.toasts

  await petra.importWalletFromMnemonicPhrase('0xdeadbeef')

  await expect(petraPage.locator(toastElement)).toContainText(/Error: Invalid mnemonic/i)
})
