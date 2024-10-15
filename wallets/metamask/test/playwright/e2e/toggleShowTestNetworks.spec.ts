import { testWithSynpress } from '@synthetixio/synpress-core'
import { MetaMask, metaMaskFixtures } from '../../../src/playwright'

import Selectors from '../../../src/selectors/pages/HomePage'
import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(metaMaskFixtures(basicSetup))

const { expect } = test

test('should toggle the "Show test networks" option from the networks dropdown', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await metamaskPage.locator(metamask.homePage.selectors.networkDropdown.dropdownButton).click()

  const networksCountBefore = await metamaskPage.locator(metamask.homePage.selectors.networkDropdown.networks).count()

  await metamaskPage.locator(metamask.homePage.selectors.networkDropdown.closeDropdownButton).click()

  await metamask.toggleShowTestNetworks()

  await metamaskPage.locator(Selectors.networkDropdown.dropdownButton).click()

  // We have to wait for the toggle to be "toggled". This is a hacky workaround, unfortunately.
  await expect(metamaskPage.locator(Selectors.networkDropdown.showTestNetworksToggle)).toHaveClass(/toggle-button--on/)

  const networksCountAfter = await metamaskPage.locator(metamask.homePage.selectors.networkDropdown.networks).count()

  expect(networksCountAfter).toBeGreaterThan(networksCountBefore)
})
