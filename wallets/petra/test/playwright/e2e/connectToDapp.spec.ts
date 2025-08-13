import { testWithSynpress } from '@synthetixio/synpress-core'
import { Petra, petraFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(petraFixtures(basicSetup))

const { expect } = test

test('should connect multiple wallets to dapp', async ({ context, page, petraPage, extensionId }) => {
  test.setTimeout(20_000)

  const petra = new Petra(context, petraPage, basicSetup.walletPassword, extensionId)

  // In Petra, when creaing new accounts, there is no option to name the account. The default name is "Account".
  // To fix this, we have to rename the accounts after creating them.
  await petra.addNewAccount('Main Account 1')
  await petra.addNewAccount('Main Account 2')

  await page.goto('/')
  // Delay to avoid random fails
  await page.locator('#connectButton').click({ delay: 2_000 })

  await petra.connectToDapp('')

  // Get address for account connected to testdapp
  await expect(page.locator('#accounts')).toContainText('0x')

  // Verify that active account in Petra extension is 'Main Account 2'
  await expect(petraPage.locator(petra.homePage.selectors.accountMenu.accountName)).toHaveText('Main Account 2')

  // Switch to 'Main Account 1' in Petra extension and verify that this is the one connected to test dapp
  await petra.switchAccount('Main Account 1')
  await page.reload()
  await petra.connectToDapp('')

  const petraMainAccount1Address = await petra.getAccountAddress()

  await page.locator('#accounts').click()
  await page.getByRole('menuitem', { name: /copy address/i }).click()

  const handle = await page.evaluateHandle(() => navigator.clipboard.readText())
  const testDappAccountAddress = await handle.jsonValue()

  // Two accounts connected
  expect(testDappAccountAddress.toLowerCase()).toEqual(petraMainAccount1Address.toLowerCase())
})
