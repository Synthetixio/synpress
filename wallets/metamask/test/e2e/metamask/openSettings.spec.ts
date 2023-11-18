import { testWithSynpress } from 'fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { expect } = test

test('should open settings', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await metamask.openSettings()

  const SidebarMenus = metamask.homePage.selectors.settings.SettingsSidebarMenus
  await expect(
    metamaskPage.locator(metamask.homePage.selectors.settings.sidebarMenu(SidebarMenus.General))
  ).toBeVisible()
})
