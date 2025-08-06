import type { Page } from '@playwright/test'
import Selectors from '../../../../../selectors/pages/HomePage'
import { clickLocatorIfCondition } from '../../../../utils/clickLocatorIfCondition'

export async function closeRecoveryPhraseReminder(page: Page) {
  const closeButtonLocator = page.locator(Selectors.recoveryPhraseReminder.gotItButton).first()

  // TODO: Extract & make configurable
  await clickLocatorIfCondition(closeButtonLocator, () => closeButtonLocator.isVisible(), 1_000)
}
