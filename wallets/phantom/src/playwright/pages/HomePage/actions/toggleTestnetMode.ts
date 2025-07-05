import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'

// Toggling this through the network dropdown instead of the settings page is a better approach.
// This is in most cases the faster approach, but it's also more reliable.
export async function toggleTestnetMode(page: Page) {
  await page.locator(Selectors.accountMenu.accountButton).click()

  await page.locator(Selectors.accountMenu.settings).click()

  await page.locator(Selectors.settings.developerSettingsButton).click()

  await page.locator(Selectors.settings.devSettings.toggleTestnetMode).click()
}
