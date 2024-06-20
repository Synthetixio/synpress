import type { BrowserContext, Page } from '@playwright/test'
import { errors } from '@playwright/test'

export async function getNotificationPageAndWaitForLoad(context: BrowserContext, extensionId: string) {
  const notificationPageUrl = `chrome-extension://${extensionId}/notification.html`

  const isNotificationPage = (page: Page) => page.url().includes(notificationPageUrl)

  // Check if notification page is already open.
  let notificationPage = context.pages().find(isNotificationPage)

  if (!notificationPage) {
    notificationPage = await context.waitForEvent('page', {
      predicate: isNotificationPage
    })
  }

  // Set pop-up window viewport size to resemble the actual MetaMask pop-up window.
  await notificationPage.setViewportSize({
    width: 360,
    height: 592
  })

  await notificationPage.waitForLoadState('domcontentloaded')

  const loadingIndicators = [
    '.loading-logo',
    '.loading-spinner',
    '.loading-overlay',
    '.loading-overlay__spinner',
    '.loading-span',
    '.loading-indicator',
    '#loading__logo',
    '#loading__spinner',
    '.mm-button-base__icon-loading',
    '.loading-swaps-quotes',
    '.loading-heartbeat'
  ]

  const timeout = 5000
  for (const selector of loadingIndicators) {
    try {
      console.log(`Loading indicator '${selector}' found, waiting for it to disappear`)
      await notificationPage.waitForSelector(selector, { state: 'hidden', timeout })
    } catch (error) {
      if (error instanceof errors.TimeoutError) {
        console.log(`Loading indicator '${selector}' not found - continuing.`)
      } else {
        console.log(`Error while waiting for loading indicator '${selector}' to disappear`)
        throw error
      }
    }
  }

  return notificationPage
}
