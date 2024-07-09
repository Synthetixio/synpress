import type { Page } from '@playwright/test'
import { homePageElements } from '../selectors'

export const backToMain = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded')
  await page.click(homePageElements.connectedSites.trustedAppsBackButton)
  await page.click(homePageElements.settingsMenu.settingsSidebarCloseButton)
}
