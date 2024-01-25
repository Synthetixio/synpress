import { testWithSynpress } from '@synthetixio/synpress-fixtures'
import { MetaMask, unlockForFixture } from '../../../src'
import { z } from 'zod'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { expect } = test

test('should rename current account with specified name', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  const accountName = 'Test Account'
  await metamask.renameAccount(accountName)

  await expect(metamaskPage.locator(metamask.homePage.selectors.accountMenu.accountButton)).toHaveText(accountName)
})

test('should throw Zod error if an empty account name is passed', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await expect(metamask.renameAccount('')).rejects.toThrowError(z.ZodError)
})

test('should throw Zod error if a reserved account name is passed', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await expect(metamask.renameAccount('Account 12')).rejects.toThrowError(z.ZodError)
})