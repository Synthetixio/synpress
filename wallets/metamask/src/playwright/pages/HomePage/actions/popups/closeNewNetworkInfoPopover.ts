import type { Page } from '@playwright/test'
import { clickLocatorIfCondition } from '../../../../utils/clickLocatorIfCondition'
import Selectors from '../../selectors'

export async function closeNewNetworkInfoPopover(page: Page) {
  const gotItButtonLocator = page.locator(Selectors.newNetworkInfoPopover.gotItButton)

  // TODO: Extract & make configurable
  await clickLocatorIfCondition(gotItButtonLocator, () => gotItButtonLocator.isVisible(), 1_000)
}
