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

      try {
        // First attempt to position the window using CDP directly
        // This helps prevent issues where part of the popup is off-screen
        // and transaction confirmation buttons can't be clicked
        await positionWindowWithCDP(notificationPage)
      } catch (positionError) {
        console.warn(
          `[getNotificationPageAndWaitForLoad] CDP positioning failed: ${positionError}. Trying alternative method.`
        )

        try {
          // Fallback method: Use Playwright's own window positioning if available
          await notificationPage.evaluate(() => {
            // Position window safely on screen
            window.moveTo(50, 50)

            // Alternative strategy if window.moveTo doesn't work
            if (window.screenX > window.screen.availWidth - 400 || window.screenY > window.screen.availHeight - 650) {
              // If popup is positioned off-screen, try to move it to a visible area
              window.moveTo(Math.min(50, window.screen.availWidth - 400), Math.min(50, window.screen.availHeight - 650))
            }
          })
        } catch (fallbackError) {
          // If all positioning attempts fail, log but continue (non-critical)
          console.warn(`[getNotificationPageAndWaitForLoad] Fallback positioning also failed: ${fallbackError}`)
        }
      }

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

// Helper function to position window using Chrome DevTools Protocol
async function positionWindowWithCDP(page: Page): Promise<void> {
  try {
    // Create a new CDP session using Playwright's public API
    const cdpSession = await page.context().newCDPSession(page)

    // Get the target info to retrieve the target ID
    const targetInfo = await cdpSession.send('Target.getTargetInfo')
    const targetId = targetInfo.targetInfo.targetId

    // Get the window ID for the target using the proper CDP method
    const windowForTarget = await cdpSession.send('Browser.getWindowForTarget', {
      targetId: targetId
    })
    const windowId = windowForTarget.windowId

    // Set the window position using the CDP session with the correct window ID
    await cdpSession.send('Browser.setWindowBounds', {
      windowId: windowId,
      bounds: {
        left: 50, // Position from left edge of screen
        top: 50 // Position from top edge of screen
      }
    })

    // Close the CDP session when done
    await cdpSession.detach()
  } catch (error) {
    // Log the error but don't throw, as this is a non-critical operation
    console.warn(`[positionWindowWithCDP] Failed to position window using CDP: ${error}`)
  }
}
