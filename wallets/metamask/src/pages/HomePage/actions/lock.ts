import type { Page } from '@playwright/test'
import Selectors from '../selectors'

export async function lock(page: Page) {
  await page.locator(Selectors.accountMenu.accountMenuButton).click()
  await page.locator(Selectors.accountMenu.lockButton).click()
}
