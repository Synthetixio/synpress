import { testWithSynpress } from '@synthetixio/synpress-core'
import { Phantom, phantomFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(phantomFixtures(basicSetup))

const { expect } = test

test('should add a new account with specified name', async ({ context, phantomPage }) => {
  const phantom = new Phantom(context, phantomPage, basicSetup.walletPassword)

  const accountName = 'Test Account'
  await phantom.addNewAccount(accountName)

  await expect(phantomPage.locator(phantom.homePage.selectors.accountMenu.accountName)).toHaveText(accountName)
})

test('should throw an error if an empty account name is passed', async ({ context, phantomPage }) => {
  const phantom = new Phantom(context, phantomPage, basicSetup.walletPassword)

  await expect(phantom.addNewAccount('')).rejects.toThrowError('[AddNewAccount] Account name cannot be an empty string')
})
