import { testWithSynpress } from '@synthetixio/synpress-core'
import { MetaMask, metaMaskFixtures } from '../../../src/playwright'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(metaMaskFixtures(basicSetup))

const { expect } = test

test('should open correct menu from the sidebar', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await metamask.openSettings()

  await expect(
    metamaskPage.locator(metamask.homePage.selectors.settings.advanced.showTestNetworksToggle).last()
  ).not.toBeVisible()

  const SidebarMenus = metamask.homePage.selectors.settings.SettingsSidebarMenus
  await metamask.openSidebarMenu(SidebarMenus.Advanced)

  await expect(
    metamaskPage.locator(metamask.homePage.selectors.settings.advanced.showTestNetworksToggle).last()
  ).toBeVisible()
})
