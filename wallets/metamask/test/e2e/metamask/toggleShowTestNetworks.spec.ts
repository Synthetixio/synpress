import { testWithSynpress } from '@synthetixio/synpress-fixtures'
import { MetaMask, unlockForFixture } from '../../../src'

import Selectors from '../../../src/pages/HomePage/selectors'
import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

const { expect } = test

test('should toggle the "Show test networks" option from the networks dropdown', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await metamaskPage.locator(metamask.homePage.selectors.networkDropdown.dropdownButton).click()

  const networksCountBefore = await metamaskPage.locator(metamask.homePage.selectors.networkDropdown.networks).count()

  await metamaskPage.locator(metamask.homePage.selectors.networkDropdown.closeDropdownButton).click()

  await metamask.toggleShowTestNetworks()

  // We have to wait for the toggle to be "toggled". This is a hacky workaround, unfortunately.
  await expect(metamaskPage.locator(Selectors.networkDropdown.showTestNetworksToggle)).toHaveClass(/toggle-button--on/)

  const networksCountAfter = await metamaskPage.locator(metamask.homePage.selectors.networkDropdown.networks).count()

  expect(networksCountAfter).toBeGreaterThan(networksCountBefore)
})
