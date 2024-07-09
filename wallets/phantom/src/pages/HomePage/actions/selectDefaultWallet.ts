import type { Page } from '@playwright/test'
import { getNotificationPageAndWaitForLoad } from '../../../utils/getNotificationAndWaitForLoads'
import { homePageElements } from '../selectors'

export const selectDefaultWallet = async (page: Page, extensionId: string, wallet: string) => {
  console.log(wallet)
  const notificationPage = await getNotificationPageAndWaitForLoad(page.context(), extensionId)
  const walletSelector = homePageElements.defaultWallet['phantom']
  await notificationPage.click(homePageElements.settingsMenu.settingsMenuButton)
  await notificationPage.click(homePageElements.settingsMenu.settingsSidebarButton)
  await notificationPage.click(homePageElements.settingsMenu.settingsPreferencesButton)
  await notificationPage.click(homePageElements.settingsMenu.defaultAppWalletRow)
  await notificationPage.click(walletSelector)
  await notificationPage.click(homePageElements.connectedSites.trustedAppsBackButton)
}
