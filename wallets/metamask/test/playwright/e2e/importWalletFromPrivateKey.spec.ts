import { testWithSynpress } from '@synthetixio/synpress-core'
import { MetaMask, metaMaskFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(metaMaskFixtures(basicSetup))

const { expect } = test

test('should import a new wallet from private key', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await metamask.importWalletFromPrivateKey('ea084c575a01e2bbefcca3db101eaeab1d8af15554640a510c73692db24d0a6a')

  await expect(metamaskPage.locator(metamask.homePage.selectors.copyAccountAddressButton)).toHaveText('0xa2ce7...26801')
})

test('should throw an error if trying to import private key for the 2nd time', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  const privateKey = 'ea084c575a01e2bbefcca3db101eaeab1d8af15554640a510c73692db24d0a6a'

  await metamask.importWalletFromPrivateKey(privateKey)

  const importWalletPromise = metamask.importWalletFromPrivateKey(privateKey)

  await expect(importWalletPromise).rejects.toThrowError(
    '[ImportWalletFromPrivateKey] Importing failed due to error: KeyringController - The account you are trying to import is a duplicate'
  )
})

test('should throw an error if the private key is invalid', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  const importWalletPromise = metamask.importWalletFromPrivateKey('0xdeadbeef')

  await expect(importWalletPromise).rejects.toThrowError(
    '[ImportWalletFromPrivateKey] Importing failed due to error: Expected private key to be an Uint8Array with length 32'
  )
})
