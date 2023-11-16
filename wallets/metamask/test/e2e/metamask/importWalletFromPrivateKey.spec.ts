import { testWithSynpress } from 'fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { expect } = test

test.use({
  permissions: ['clipboard-read']
})

test('should import a new wallet from private key', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await metamask.importWalletFromPrivateKey('ea084c575a01e2bbefcca3db101eaeab1d8af15554640a510c73692db24d0a6a')

  await metamaskPage.locator(metamask.homePage.selectors.account).click()

  const accountAddressInClipboard = await metamaskPage.evaluate('navigator.clipboard.readText()')
  expect(accountAddressInClipboard).toContain('0xa2ce797cA71d0EaE1be5a7EffD27Fd6C38126801')
})

test('should throw an error if trying to import private key for the 2nd time', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  const privateKey = 'ea084c575a01e2bbefcca3db101eaeab1d8af15554640a510c73692db24d0a6a'

  await metamask.importWalletFromPrivateKey(privateKey)

  await metamaskPage.locator(metamask.homePage.selectors.account).click()

  const importWalletPromise = metamask.importWalletFromPrivateKey(privateKey)

  await expect(importWalletPromise).rejects.toThrowError(
    '[ImportWalletFromPrivateKey] Importing failed due to error: The account you are trying to import is a duplicate'
  )
})

test('should throw an error if the private key is invalid', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  const importWalletPromise = metamask.importWalletFromPrivateKey('0xdeadbeef')

  await expect(importWalletPromise).rejects.toThrowError(
    '[ImportWalletFromPrivateKey] Importing failed due to error: Expected private key to be an Uint8Array with length 32'
  )
})
