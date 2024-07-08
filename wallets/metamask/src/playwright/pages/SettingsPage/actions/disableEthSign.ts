import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/SettingsPage'

export default async function disableEthSign(page: Page) {
  await page.locator(Selectors.settings.advancedSettings).click()
  await page.locator(Selectors.settings.ethSignToggle).click()
}
