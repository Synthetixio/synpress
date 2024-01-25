import { testWithSynpress } from '@synthetixio/synpress-fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { expect } = test

test('should rename current account with specified name', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  const accountName = 'Test Account'
  await metamask.renameAccount(accountName)

  await expect(metamaskPage.locator(metamask.homePage.selectors.accountMenu.accountButton)).toHaveText(accountName)
})

test('should throw an error if an empty account name is passed', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await expect(metamask.renameAccount('')).rejects.toThrowError(
    '[RenameAccount] Account name cannot be an empty string'
  )
})