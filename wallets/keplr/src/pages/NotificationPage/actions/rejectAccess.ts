import type { Page } from '@playwright/test'
import { getNotificationPageAndWaitForLoad } from '../../../getNotificationPageAndWaitForLoad'
import { getExtensionId } from '../../../fixtureActions'

export const rejectAccess = async (page: Page) => {
  const extensionId = await getExtensionId(page.context(), 'keplr')
  const notificationPage = await getNotificationPageAndWaitForLoad(page.context(), extensionId)
  await notificationPage.close()
}
