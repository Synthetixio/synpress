import { testWithSynpress } from 'fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

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
