import type { Page } from '@playwright/test'
import { clickLocatorIfCondition } from '../../../../utils/closePopup'
import Selectors from '../../selectors'

export async function closeRecoveryPhraseReminder(page: Page) {
  const closeButtonLocator = page.locator(Selectors.recoveryPhraseReminder.gotItButton)

  // TODO: Extract & make configurable
  await clickLocatorIfCondition(closeButtonLocator, () => closeButtonLocator.isVisible(), 1_000)
}
