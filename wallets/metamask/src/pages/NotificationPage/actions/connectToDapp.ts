import type { BrowserContext } from '@playwright/test'
import { getNotificationPage } from '../../../utils/getNotificationPage'

export async function connectToDapp(context: BrowserContext, extensionId: string) {
  const notificationPage = await getNotificationPage(context, extensionId)

  // Click `Next`.
  await notificationPage.getByRole('button').nth(1).click()

  // Click `Connect`.
  await notificationPage.getByRole('button').nth(1).click()
}
