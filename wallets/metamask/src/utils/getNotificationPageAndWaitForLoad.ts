import type { BrowserContext, Page } from '@playwright/test'
import { LoadingSelectors } from '../selectors'
import { waitUntilStable } from './waitFor'
import { waitForSelector } from './waitFor'

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

  await waitUntilStable(notificationPage as Page)

  // Set pop-up window viewport size to resemble the actual MetaMask pop-up window.
  await notificationPage.setViewportSize({
    width: 360,
    height: 592
  })

  await Promise.all(
    LoadingSelectors.loadingIndicators.map(async (selector) => {
      await waitForSelector(selector, notificationPage as Page, 5000)
    })
  )
    .then(() => {
      console.log('All loading indicators are hidden')
    })
    .catch((error) => {
      console.error('Error: ', error)
    })

  return notificationPage
}
