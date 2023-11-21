import type { Page } from '@playwright/test'
import { waitFor } from '../../../utils/waitFor'
import Selectors from '../selectors'

const closeRecoveryPhraseReminder = async (page: Page) => {
  const recoveryPhraseReminder = page.locator(Selectors.recoveryPhraseReminder.gotItButton)

  const isRecoveryPhraseReminderHidden = await waitFor(() => recoveryPhraseReminder.isHidden(), 1_000, false)
  if (!isRecoveryPhraseReminderHidden) {
    await recoveryPhraseReminder.click()
  }
}

const closeTippyPopper = async (page: Page) => {
  const tooltipCloseButtonLocator = page.locator(Selectors.tippyPopper.closeButton)

  const isTooltipHidden = await waitFor(() => tooltipCloseButtonLocator.isHidden(), 1_000, false)
  if (!isTooltipHidden) {
    await tooltipCloseButtonLocator.click()
  }
}

const closePopover = async (page: Page) => {
  const popoverCloseButtonLocator = page.locator(Selectors.popover.closeButton)

  const isPopoverHidden = await waitFor(() => popoverCloseButtonLocator.isHidden(), 1_000, false)
  if (!isPopoverHidden) {
    await popoverCloseButtonLocator.click()
  }
}

export async function closeTooltipsIfAnyAreVisible(page: Page) {
  await closeRecoveryPhraseReminder(page)
  await closePopover(page)
  await closeTippyPopper(page)
}
