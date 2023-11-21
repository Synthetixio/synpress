import { testWithSynpress } from 'fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import Selectors from '../../../src/pages/HomePage/selectors'
import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { expect } = test

test('should toggle the "Show test networks" option', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await metamaskPage.locator(metamask.homePage.selectors.networkDropdown.dropdownButton).click()

  const networksCountBefore = await metamaskPage.locator(metamask.homePage.selectors.networkDropdown.networks).count()

  // We're closing the network dropdown with this.
  await metamask.goBackToHomePage()

  await metamask.openSettings()

  const SidebarMenus = metamask.homePage.selectors.settings.SettingsSidebarMenus
  await metamask.openSidebarMenu(SidebarMenus.Advanced)

  await metamask.toggleShowTestNetworks()

  // We have to wait for the toggle to be "toggled". This is a hacky workaround, unfortunately.
  await expect(metamaskPage.locator(Selectors.settings.advanced.showTestNetworksToggle).nth(1)).toHaveClass(
    /toggle-button--on/
  )

  await metamaskPage.locator(metamask.homePage.selectors.networkDropdown.dropdownButton).click()

  const networksCountAfter = await metamaskPage.locator(metamask.homePage.selectors.networkDropdown.networks).count()

  expect(networksCountAfter).toBeGreaterThan(networksCountBefore)
})
