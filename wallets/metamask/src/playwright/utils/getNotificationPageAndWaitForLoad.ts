import type { BrowserContext, Page } from '@playwright/test'
import { errors } from '@playwright/test'
import { waitForMetaMaskLoad, waitUntilStable } from './waitFor'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const NOTIFICATION_PAGE_TIMEOUT = 10000

export async function getNotificationPageAndWaitForLoad(context: BrowserContext, extensionId: string, maxRetries = 2) {
  const notificationPageUrl = `chrome-extension://${extensionId}/notification.html`
  const isNotificationPage = (page: Page) => page.url().includes(notificationPageUrl)

  let retries = 0
  let notificationPage: Page | undefined

  while (retries <= maxRetries) {
    try {
      // Check if notification page is already open
      notificationPage = context.pages().find(isNotificationPage)

      if (!notificationPage) {
        // Wait for notification page to appear with timeout
        notificationPage = await context.waitForEvent('page', {
          predicate: isNotificationPage,
          timeout: NOTIFICATION_PAGE_TIMEOUT
        })
      }

      // Ensure page is fully loaded
      await waitUntilStable(notificationPage as Page)

      // Set pop-up window viewport size to resemble the actual MetaMask pop-up window
      await notificationPage.setViewportSize({
        width: 360,
        height: 592
      })

      // Wait for MetaMask UI to load
      return await waitForMetaMaskLoad(notificationPage)
    } catch (error) {
      retries++

      if (retries <= maxRetries) {
        console.warn(
          `[getNotificationPageAndWaitForLoad] Failed to get notification page, retrying (attempt ${retries}/${maxRetries})...`
        )

        await sleep(1000 * retries)
        continue
      }

      if (error instanceof errors.TimeoutError) {
        throw new Error(
          `[getNotificationPageAndWaitForLoad] Notification page did not appear after ${NOTIFICATION_PAGE_TIMEOUT}ms and ${maxRetries} retries.`
        )
      }

      throw new Error(`[getNotificationPageAndWaitForLoad] Failed to get notification page: ${error}`)
    }
  }

  // This should never be reached
  throw new Error('[getNotificationPageAndWaitForLoad] Unexpected end of function reached')
}
