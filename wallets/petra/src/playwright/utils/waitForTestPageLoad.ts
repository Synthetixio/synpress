import type { BrowserContext, Page } from '@playwright/test'
import { waitUntilStable } from './waitFor'

export async function waitForTestPageLoad(context: BrowserContext) {
  const testPageUrl = 'about:blank'

  const isTestPage = (page: Page) => page.url().includes(testPageUrl)

  // Check if test page is already open.
  let testPage = context.pages().find(isTestPage)

  if (!testPage) {
    testPage = await context.waitForEvent('page', {
      predicate: isTestPage,
      timeout: 10_000
    })
  }

  await waitUntilStable(testPage as Page)
}
