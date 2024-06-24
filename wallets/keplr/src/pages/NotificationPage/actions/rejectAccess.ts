import type { Page } from '@playwright/test'
import { getExtensionId } from '../../../fixtureActions'
import { getNotificationPageAndWaitForLoad } from '../../../getNotificationPageAndWaitForLoad'

export const rejectAccess = async (page: Page) => {
  const extensionId = await getExtensionId(page.context(), 'keplr')
  const notificationPage = await getNotificationPageAndWaitForLoad(page.context(), extensionId)
  await notificationPage.close()
}
