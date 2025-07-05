import type { Page } from '@playwright/test'
import { homePage, notificationPage } from '../../../../selectors'

async function openSettings(page: Page) {
  await page.locator(homePage.accountMenu.accountButton).click()
  await page.locator(homePage.accountMenu.settings).click()
}

async function resetApp(page: Page) {
  await openSettings(page)

  await page.locator(homePage.settings.securityAndPrivacyButton).click()

  await page.waitForSelector(homePage.settings.securityAndPrivacy.resetApp)
  await page.locator(homePage.settings.securityAndPrivacy.resetApp).click()

  await page.locator(notificationPage.ActionFooter.continueActionButton).click()
}

export const settings = {
  openSettings,
  resetApp
}
