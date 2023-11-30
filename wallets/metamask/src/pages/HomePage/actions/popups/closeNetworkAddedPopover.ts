import type { Page } from '@playwright/test'
import { clickLocatorIfCondition } from '../../../../utils/clickLocatorIfCondition'
import Selectors from '../../selectors'

// Note: The "Dismiss" button does NOTHING and the network is ALWAYS automatically switched.
export async function closeNetworkAddedPopover(page: Page) {
  const switchNetworkButtonLocator = page.locator(Selectors.networkAddedPopover.switchToNetworkButton)

  // TODO: Extract & make configurable
  await clickLocatorIfCondition(switchNetworkButtonLocator, () => switchNetworkButtonLocator.isVisible(), 1_000)
}
