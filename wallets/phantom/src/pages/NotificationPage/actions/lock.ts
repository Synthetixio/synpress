import type { Page } from '@playwright/test'
import { notificationPageElements } from '../selectors'
import { settingsPageElements } from '../../SettingsPage/selectors'
import { closePopupAndTooltips } from '../../HomePage/actions/closePopupAndTooltips'

export const lock = async (page: Page, extensionId: string) => {
  await page.waitForLoadState('domcontentloaded')
  await page.click(notificationPageElements.menu.buttons.settings);
  await page.click(notificationPageElements.menu.buttons.sidebar.settings)
  await page.click(settingsPageElements.buttons.lockWallet)

  await closePopupAndTooltips(page, extensionId);
  return true;
}