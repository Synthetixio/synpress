import type { BrowserContext } from '@playwright/test'
import { getNotificationPageAndWaitForLoad } from '../../../utils/getNotificationPageAndWaitForLoad'

export async function connectToDapp(context: BrowserContext, extensionId: string) {
  const notificationPage = await getNotificationPageAndWaitForLoad(context, extensionId)

  // Click `Next`.
  await notificationPage.getByRole('button').nth(1).click()

  // Click `Connect`.
  await notificationPage.getByRole('button').nth(1).click()
}
