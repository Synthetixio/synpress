import { testWithSynpress } from '@synthetixio/synpress-core'
import { ZodError } from 'zod'
import { Petra, petraFixtures } from '../../../src/playwright'
import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(petraFixtures(basicSetup))

const { expect } = test

test('should add a new account with specified name', async ({ context, petraPage }) => {
  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  const accountName = 'Test Account'
  await petra.addNewAccount(accountName)

  await expect(petraPage.locator(petra.homePage.selectors.accountMenu.accountName)).toHaveText(accountName)
})

test('should throw an error if an empty account name is passed', async ({ context, petraPage }) => {
  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  await expect(petra.addNewAccount('')).rejects.toThrowError(ZodError)
})
