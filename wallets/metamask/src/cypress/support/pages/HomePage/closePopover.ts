import type { Page } from '@playwright/test'
import { homePage } from '../../../../selectors'

// Closes the popover with news, rainbows, unicorns, and other stuff.
export async function closePopover(page: Page) {
  // We're using `first()` here just in case there are multiple popovers, which happens sometimes.
  const closeButtonLocator = page.locator(homePage.popover.closeButton).first()

  await closeButtonLocator.click()

  // TODO: Extract & make configurable
  // await clickLocatorIfCondition(closeButtonLocator, () => closeButtonLocator.isVisible(), 1_000)
}
