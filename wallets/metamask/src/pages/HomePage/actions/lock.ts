import type { Page } from '@playwright/test'
import Selectors from '../selectors'

export async function lock(page: Page) {
  await page.locator(Selectors.threeDotsMenu.threeDotsButton).click()
  await page.locator(Selectors.threeDotsMenu.lockButton).click()
}
