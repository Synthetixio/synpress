import type { Page } from '@playwright/test'
import Selectors from '../../../../../selectors/pages/HomePage'
import { clickLocatorIfCondition } from '../../../../utils/clickLocatorIfCondition'

export async function closeNewNetworkInfoPopover(page: Page) {
  const gotItButtonLocator = page.locator(Selectors.newNetworkInfoPopover.gotItButton).first()

  // TODO: Extract & make configurable
  await clickLocatorIfCondition(gotItButtonLocator, () => gotItButtonLocator.isVisible(), 1_000)
}
