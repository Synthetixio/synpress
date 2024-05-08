import { MetaMask, metaMaskFixtures, testWithSynpress } from '@synthetixio/synpress'
import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(metaMaskFixtures(basicSetup))

const { expect } = test

test('should connect wallet to the MetaMask Test Dapp', async ({ context, page, metamaskPage, extensionId }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId)

  await page.goto('/')

  await page.locator('#connectButton').click()
  await metamask.connectToDapp()
  await expect(page.locator('#accounts')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')

  await page.locator('#getAccounts').click()
  await expect(page.locator('#getAccountsResult')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
})
