import type { Page } from '@playwright/test'
import { clickLocatorIfCondition } from '../../../../utils/clickLocatorIfCondition'

export async function closeWhatsNewPopover(page: Page) {
  // The "What's new" popover has an X button with aria-label="Close"
  const closeButtonLocator = page.locator('[aria-label="Close"]').first()

  // TODO: Extract & make configurable
  await clickLocatorIfCondition(closeButtonLocator, () => closeButtonLocator.isVisible(), 1_000)
}
