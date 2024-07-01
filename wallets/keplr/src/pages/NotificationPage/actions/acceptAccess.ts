import type { Page } from '@playwright/test'
import { getExtensionId } from '../../../fixtureActions'
import { getNotificationPageAndWaitForLoad } from '../../../getNotificationPageAndWaitForLoad'
import { notificationPageElements } from '../selectors'

export const acceptAccess = async (page: Page) => {
  const extensionId = await getExtensionId(page.context(), 'keplr')
  const notificationPage = await getNotificationPageAndWaitForLoad(page.context(), extensionId)
  await notificationPage.waitForLoadState('domcontentloaded')
  await notificationPage.waitForSelector(notificationPageElements.approveButton)
  await notificationPage.click(notificationPageElements.approveButton)
  return true
}
