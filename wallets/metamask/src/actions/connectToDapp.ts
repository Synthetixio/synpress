import type { BrowserContext } from '@playwright/test'
import { getNotificationPage } from '../utils/getNotificationPage'

export async function connectToDapp(context: BrowserContext, extensionId: string) {
  const notificationPage = await getNotificationPage(context, extensionId)

  if (!process.env.HEADLESS) {
    // Set pop-up window viewport size to resemble the actual MetaMask pop-up window.
    await notificationPage.setViewportSize({
      width: 360,
      height: 592
    })
  }

  // Click `Next`.
  await notificationPage.getByRole('button').nth(1).click()

  // Click `Connect`.
  await notificationPage.getByRole('button').nth(1).click()
}
