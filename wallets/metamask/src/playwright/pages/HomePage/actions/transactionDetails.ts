import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'
import { waitFor } from '../../../utils/waitFor'

const openTransactionDetails = async (page: Page, txIndex: number) => {
  await page.locator(Selectors.activityTab.activityTabButton).click()

  const visibleTxs = await page.locator(Selectors.activityTab.completedTransactions).count()

  if (txIndex >= visibleTxs) {
    throw new Error(
      `[OpenTransactionDetails] Transaction with index ${txIndex} is not visible. There are only ${visibleTxs} transactions visible.`
    )
  }

  await page.locator(Selectors.activityTab.completedTransactions).nth(txIndex).click()

  // TODO: Extract timeout.
  await waitFor(() => page.locator(Selectors.popover.closeButton).first().isVisible(), 3_000)
}

const closeTransactionDetails = async (page: Page) => {
  await page.locator(Selectors.popover.closeButton).first().click()
}

export const transactionDetails = {
  open: openTransactionDetails,
  close: closeTransactionDetails
}
