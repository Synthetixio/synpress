import type { BrowserContext, Page } from '@playwright/test'

export async function getNotificationPage(context: BrowserContext, extensionId: string) {
  const notificationPageUrl = `chrome-extension://${extensionId}/notification.html`

  /**
   * If running in headless mode, create a new notification page manually.
   *
   * This is a workaround due to a bug in Chromium/MetaMask where pop-up windows
   * are not created in the new headless mode.
   */
  if (process.env.HEADLESS) {
    const notificationPage = await context.newPage()
    await notificationPage.goto(notificationPageUrl)

    return notificationPage
  }

  const isNotificationPage = (page: Page) => page.url().includes(notificationPageUrl)

  // Check if notification page is already open.
  const notificationPage = context.pages().find(isNotificationPage)

  if (notificationPage) {
    return notificationPage
  }

  return await context.waitForEvent('page', { predicate: isNotificationPage })
}
