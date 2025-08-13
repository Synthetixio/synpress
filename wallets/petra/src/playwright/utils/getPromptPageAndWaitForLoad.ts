import type { BrowserContext, Page } from '@playwright/test'
import { waitUntilStablePromptPage } from './waitFor'

export async function getPromptPageAndWaitForLoad(context: BrowserContext, extensionId: string) {
  const promptPageUrl = `chrome-extension://${extensionId}/prompt.html`

  const isPromptPage = (page: Page) => page.url().includes(promptPageUrl)

  // Check if notification page is already open.
  let promptPage = context.pages().find(isPromptPage)

  if (!promptPage) {
    promptPage = await context.waitForEvent('page', {
      predicate: isPromptPage,
      timeout: 50_000
    })
  }

  await waitUntilStablePromptPage(promptPage as Page)

  // Set pop-up window viewport size to resemble the actual Phantom pop-up window.
  await promptPage.setViewportSize({
    width: 360,
    height: 592
  })

  await waitUntilStablePromptPage(promptPage as Page)

  return promptPage
}
