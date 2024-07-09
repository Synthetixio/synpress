import type { Page } from '@playwright/test'
import { getNotificationPageAndWaitForLoad } from '../../../utils/getNotificationAndWaitForLoads'
import { homePageElements } from '../selectors'

export const getWalletAddress = async (page: Page, extensionId: string, chain = 'eth') => {
  const notificationPage = await getNotificationPageAndWaitForLoad(page.context(), extensionId)
  await notificationPage.hover(homePageElements.accountBar.title)

  await new Promise((resolve) => setTimeout(resolve, 100))
  await notificationPage.waitForLoadState('domcontentloaded')

  if (chain === 'eth') {
    await notificationPage.click(homePageElements.accountBar.ethRow)
  } else if (chain === 'solana') {
    await notificationPage.click(homePageElements.accountBar.solanaRow)
  }

  const walletAddress = await notificationPage.evaluate('navigator.clipboard.readText()')
  return walletAddress
}
