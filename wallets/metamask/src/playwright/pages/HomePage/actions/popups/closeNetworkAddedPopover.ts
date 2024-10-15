import type { Page } from '@playwright/test'
import Selectors from '../../../../../selectors/pages/HomePage'
import { clickLocatorIfCondition } from '../../../../utils/clickLocatorIfCondition'

// Note: The "Dismiss" button does NOTHING and the network is ALWAYS automatically switched.
export async function closeNetworkAddedPopover(page: Page) {
  const switchNetworkButtonLocator = page.locator(Selectors.networkAddedPopover.switchToNetworkButton)

  // TODO: Extract & make configurable
  await clickLocatorIfCondition(switchNetworkButtonLocator, () => switchNetworkButtonLocator.isVisible(), 1_000)

  const switchCompleteCloseButtonLocator = page.locator(Selectors.networkAddedPopover.switchCompleteCloseButton)

  await clickLocatorIfCondition(
    switchCompleteCloseButtonLocator,
    () => switchCompleteCloseButtonLocator.isVisible(),
    1_000
  )
}
