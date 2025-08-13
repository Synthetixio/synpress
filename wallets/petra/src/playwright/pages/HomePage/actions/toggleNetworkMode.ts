import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'
import type { NetworkMode } from '../../../../type/Networks'

// Toggling this through the network dropdown instead of the settings page is a better approach.
// This is in most cases the faster approach, but it's also more reliable.
export async function toggleNetworkMode(page: Page, networkMode: NetworkMode) {
  const networkButton = {
    mainnet: Selectors.settings.mainnetButton,
    testnet: Selectors.settings.testnetButton,
    devnet: Selectors.settings.devnetButton
  }[networkMode]

  await page.locator(Selectors.settings.settingsButton).click()

  await page.locator(Selectors.settings.networkSettings).click()

  await page.locator(networkButton).click()
}
