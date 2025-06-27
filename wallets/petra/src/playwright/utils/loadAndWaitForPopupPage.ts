import { type BrowserContext, type Page, expect } from '@playwright/test'
import { waitUntilStableBeforeUnlock } from './waitFor'
import { waitForTestPageLoad } from './waitForTestPageLoad'

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
