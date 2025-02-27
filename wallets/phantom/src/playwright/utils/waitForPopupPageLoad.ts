import type { BrowserContext, Page } from '@playwright/test'
import { waitUntilStableBeforeUnlock } from './waitFor'

export async function waitForPopupPageLoad(context: BrowserContext, extensionId: string) {
  const popupPageUrl = `chrome-extension://${extensionId}/popup.html`

  const isPopupPage = (page: Page) => page.url().includes(popupPageUrl)

  // Check if popup page is already open.
  let popupPage = context.pages().find(isPopupPage)

  if (!popupPage) {
    popupPage = await context.waitForEvent('page', {
      predicate: isPopupPage,
      timeout: 10_000
    })
  }

  await waitUntilStableBeforeUnlock(popupPage as Page)
}
