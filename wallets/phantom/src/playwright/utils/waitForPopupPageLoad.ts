import { type BrowserContext, type Page, expect } from '@playwright/test'
import { waitUntilStableBeforeUnlock } from './waitFor'
import { waitForTestPageLoad } from './waitForTestPageLoad'

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

export async function loadAndWaitForPopupPage2(page: Page, extensionId: string) {
  await expect(async () => {
    await page.goto(`chrome-extension://${extensionId}/popup.html`)

    await waitUntilStableBeforeUnlock(page)
  }).toPass({ timeout: 35_000 })
}

export async function loadAndWaitForPopupPage(context: BrowserContext, extensionId: string) {
  let popupPage: Page = context.pages()[0] as Page

  await expect(async () => {
    popupPage = await context.newPage()

    await waitForTestPageLoad(context)

    await popupPage.goto(`chrome-extension://${extensionId}/popup.html`)

    await waitUntilStableBeforeUnlock(popupPage)
  }).toPass()

  return popupPage
}
