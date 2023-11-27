import type { Page } from '@playwright/test'
import { clickLocatorIfCondition } from '../../../../utils/closePopup'
import Selectors from '../../selectors'

// Closes the popover with news, rainbows, unicorns, and other stuff.
export async function closePopover(page: Page) {
  const closeButtonLocator = page.locator(Selectors.popover.closeButton)

  // TODO: Extract & make configurable
  await clickLocatorIfCondition(closeButtonLocator, () => closeButtonLocator.isVisible(), 1_000)
}
