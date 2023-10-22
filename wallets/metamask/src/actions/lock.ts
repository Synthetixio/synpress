import type { Page } from '@playwright/test'
import { HomePageSelectors } from '../selectors'

export async function lock(page: Page) {
  await page.locator(HomePageSelectors.accountMenu.accountMenuButton).click()
  await page.locator(HomePageSelectors.accountMenu.lockButton).click()
}
