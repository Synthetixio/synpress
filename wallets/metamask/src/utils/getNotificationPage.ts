import type { BrowserContext, Page } from '@playwright/test'

export async function getNotificationPage(context: BrowserContext, extensionId: string) {
  const notificationPageUrl = `chrome-extension://${extensionId}/notification.html`

  const isNotificationPage = (page: Page) => page.url().includes(notificationPageUrl)

  // Check if notification page is already open.
  let notificationPage = context.pages().find(isNotificationPage)

  if (!notificationPage) {
    notificationPage = await context.waitForEvent('page', { predicate: isNotificationPage })
  }

  // Set pop-up window viewport size to resemble the actual MetaMask pop-up window.
  await notificationPage.setViewportSize({
    width: 360,
    height: 592
  })

  return notificationPage
}
