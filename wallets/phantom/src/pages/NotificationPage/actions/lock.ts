import type { Page } from '@playwright/test'
import { closePopupAndTooltips } from '../../HomePage/actions/closePopupAndTooltips'
import { settingsPageElements } from '../../SettingsPage/selectors'
import { notificationPageElements } from '../selectors'

export const lock = async (page: Page, extensionId: string) => {
  await page.waitForLoadState('domcontentloaded')
  await page.click(notificationPageElements.menu.buttons.settings)
  await page.click(notificationPageElements.menu.buttons.sidebar.settings)
  await page.click(settingsPageElements.buttons.lockWallet)

  await closePopupAndTooltips(page, extensionId)
  return true
}
