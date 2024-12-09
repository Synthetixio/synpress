import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'
import { toggle } from '../../../utils/toggle'

// Toggling this through the network dropdown instead of the settings page is a better approach.
// This is in most cases the faster approach, but it's also more reliable.
export async function toggleShowTestNetworks(page: Page) {
  await page.locator(Selectors.networkDropdown.dropdownButton).click()

  await toggle(page.locator(Selectors.networkDropdown.showTestNetworksToggle))

  await page.locator(Selectors.networkDropdown.closeNetworkPopupButton).click()
}
