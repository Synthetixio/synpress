import type { Page } from '@playwright/test'
import Selectors from '../../../../../selectors/pages/HomePage'
import { clickLocatorIfCondition } from '../../../../utils/clickLocatorIfCondition'

// Closes the popover with news, rainbows, unicorns, and other stuff.
export async function closePopover(page: Page) {
  // We're using `first()` here just in case there are multiple popovers, which happens sometimes.
  const closeButtonLocator = page.locator(Selectors.popover.closeButton).first()

  // TODO: Extract & make configurable
  await clickLocatorIfCondition(closeButtonLocator, () => closeButtonLocator.isVisible(), 1_000)
}
