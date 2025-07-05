import type { Page } from '@playwright/test'
import { homePage } from '../../../../selectors'

async function openSettings(page: Page) {
  await page.locator(homePage.settings.settingsButton).click()
}

export const settings = {
  openSettings
}
