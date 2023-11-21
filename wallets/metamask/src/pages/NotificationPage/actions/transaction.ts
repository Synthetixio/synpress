import type { Page } from '@playwright/test'
import { waitFor } from '../../../utils/waitFor'
import HomePageSelectors from '../../HomePage/selectors'
import Selectors from '../selectors'

const confirmTransaction = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.TransactionPage.confirmButton).click()
}

const confirmTransactionAndWaitForMining = async (walletPage: Page, notificationPage: Page) => {
  await walletPage.locator(HomePageSelectors.activityTab.activityTabButton).click()

  const waitForUnapprovedTxs = async () => {
    const unapprovedTxs = await walletPage.locator(HomePageSelectors.activityTab.pendingUnapprovedTransactions).count()

    return unapprovedTxs !== 0
  }

  // TODO: Extract timeout.
  const newTxsFound = await waitFor(waitForUnapprovedTxs, 30_000, false)

  if (!newTxsFound) {
    throw new Error('No new pending transactions found in 30s')
  }

  await confirmTransaction(notificationPage)

  const waitForMining = async () => {
    const unapprovedTxs = await walletPage.locator(HomePageSelectors.activityTab.pendingUnapprovedTransactions).count()
    const pendingTxs = await walletPage.locator(HomePageSelectors.activityTab.pendingApprovedTransactions).count()
    const queuedTxs = await walletPage.locator(HomePageSelectors.activityTab.pendingQueuedTransactions).count()

    return unapprovedTxs === 0 && pendingTxs === 0 && queuedTxs === 0
  }

  // TODO: Extract timeout.
  const allTxsMined = await waitFor(waitForMining, 120_000, false)

  if (!allTxsMined) {
    throw new Error('All pending and queued transactions were not mined in 120s')
  }
}

const rejectTransaction = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.TransactionPage.rejectButton).click()
}

export const transaction = {
  confirm: confirmTransaction,
  reject: rejectTransaction,
  confirmAndWaitForMining: confirmTransactionAndWaitForMining
}
