import type { Page } from '@playwright/test'
import { getNotificationPageAndWaitForLoad } from '../../../utils/getNotificationAndWaitForLoads'
import { homePageElements } from '../selectors'

export const disconnectFromApp = async (page: Page, extensionId: string) => {
  const notificationPage = await getNotificationPageAndWaitForLoad(page.context(), extensionId)

  await notificationPage.click(homePageElements.settingsMenu.settingsMenuButton)
  await notificationPage.click(homePageElements.settingsMenu.settingsSidebarButton)
  await notificationPage.click(homePageElements.settingsMenu.trustedAppsRow)

  const rowButtonLocator = await notificationPage.locator(homePageElements.connectedSites.rowButton)
  const hasConnectedSite = await rowButtonLocator.isVisible()

  let isDisconnected = false
  if (hasConnectedSite) {
    await rowButtonLocator.click()
    await notificationPage.click(homePageElements.connectedSites.trustedAppsRevokeButton)
    isDisconnected = true
  } else {
    console.log('[disconnectWalletFromDapp] Wallet is not connected to a dapp, skipping...')
  }

  return isDisconnected
}
