import { testWithSynpress } from '@synthetixio/synpress-core'
import { MetaMask, metaMaskFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(metaMaskFixtures(basicSetup))

const { expect } = test

test('should add a new account with specified name', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  const accountName = 'Test Account'
  await metamask.addNewAccount(accountName)

  await expect(metamaskPage.locator(metamask.homePage.selectors.accountMenu.accountButton)).toHaveText(accountName)
})

test('should throw an error if an empty account name is passed', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await expect(metamask.addNewAccount('')).rejects.toThrowError(
    '[AddNewAccount] Account name cannot be an empty string'
  )
})
