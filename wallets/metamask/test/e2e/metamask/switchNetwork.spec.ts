import { testWithSynpress } from 'fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { expect } = test

test.use({
  permissions: ['clipboard-read']
})

test('should switch network', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await metamask.openSettings()

  const SidebarMenus = metamask.homePage.selectors.settings.SettingsSidebarMenus
  await metamask.openSidebarMenu(SidebarMenus.Advanced)

  await metamask.toggleShowTestNetworks()

  const networkBefore = await metamaskPage.locator(metamask.homePage.selectors.currentNetwork).textContent()

  expect(networkBefore).toEqual('Ethereum Mainnet')

  const targetNetwork = 'Sepolia test network'
  await metamask.switchNetwork(targetNetwork)

  const networkAfter = await metamaskPage.locator(metamask.homePage.selectors.currentNetwork).textContent()
  expect(networkAfter).toEqual(targetNetwork)
})

test('should throw an error if there is no account with target name', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  const accountName = 'Account 420'
  const switchAccountPromise = metamask.switchAccount(accountName)

  await expect(switchAccountPromise).rejects.toThrowError(`[SwitchAccount] Account with name ${accountName} not found`)
})
