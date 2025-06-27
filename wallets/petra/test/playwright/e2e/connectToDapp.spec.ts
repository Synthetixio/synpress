import { testWithSynpress } from '@synthetixio/synpress-core'
import { Phantom, phantomFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(phantomFixtures(basicSetup))

const { expect } = test

test('should connect multiple wallets to dapp', async ({ context, page, phantomPage, extensionId }) => {
  test.setTimeout(90_000)

  const phantom = new Phantom(context, phantomPage, basicSetup.walletPassword, extensionId)

  await phantom.addNewAccount('NewAccount1')
  await phantom.addNewAccount('NewAccount2')

  await page.goto('/')
  // Delay to avoid random fails
  await page.locator('#connectButton').click({ delay: 2_000 })

  await phantom.connectToDapp('NewAccount1')

  // Get address for account connected to testdapp
  await expect(page.locator('#accounts')).toContainText('0x')
  const testDappAccountAddress = await page.locator('#accounts').innerText()

  // Verify that active account in Phantom extension is 'NewAccount2'
  await expect(phantomPage.locator(phantom.homePage.selectors.accountMenu.accountName)).toHaveText('NewAccount2')
  // Verify that address for active account in Phantom extension is not connected to test dapp
  const phantomActiveAccountAddress = await phantom.getAccountAddress('ethereum')
  expect(testDappAccountAddress).not.toEqual(phantomActiveAccountAddress)

  // Switch to 'NewAccount1' in Phantom extension and verify that this is the one connected to test dapp
  await phantom.switchAccount('NewAccount1')
  const phantomNewAccount1Address = await phantom.getAccountAddress('ethereum')

  // Two accounts connected
  expect(testDappAccountAddress.toLowerCase()).toEqual(phantomNewAccount1Address.toLowerCase())
})
