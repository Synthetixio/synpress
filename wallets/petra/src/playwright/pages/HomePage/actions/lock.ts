import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'

export async function lock(page: Page) {
  await page.locator(Selectors.accountMenu.accountButton).click()
  await page.locator(Selectors.accountMenu.settings).click()

  await page.locator(Selectors.settings.lockWallet).click()
}
