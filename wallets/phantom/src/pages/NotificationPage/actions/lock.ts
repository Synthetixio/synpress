import type { Page } from '@playwright/test'
import { notificationPageElements } from '../selectors'
import { settingsPageElements } from '../../SettingsPage/selectors'

export const lock = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded')
  await page.click(notificationPageElements.menu.buttons.settings);
  await page.click(notificationPageElements.menu.buttons.sidebar.settings)
  await page.click(settingsPageElements.buttons.lockWallet)

  // await module.exports.closePopupAndTooltips();
  return true;
}