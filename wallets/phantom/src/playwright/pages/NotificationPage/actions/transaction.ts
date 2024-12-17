import type { Page } from '@playwright/test'
import HomePageSelectors from '../../../../selectors/pages/HomePage'
import Selectors from '../../../../selectors/pages/NotificationPage'
import { GasSettingValidation, type GasSettings } from '../../../../type/GasSettings'
import { waitFor } from '../../../utils/waitFor'

const confirmTransaction = async (notificationPage: Page, options: GasSettings) => {
  const gasSetting = GasSettingValidation.parse(options)

  const handleNftSetApprovalForAll = async (page: Page) => {
    try {
      const nftApproveButtonLocator = page.locator(
        Selectors.TransactionPage.nftApproveAllConfirmationPopup.approveButton
      )
      const isNfTPopupHidden = await waitFor(() => nftApproveButtonLocator.isHidden(), 3_000, false)

      if (!isNfTPopupHidden) {
        await nftApproveButtonLocator.click()
      }
    } catch (e) {
      if (page.isClosed()) {
        return
      }

      throw new Error(`Failed to handle NFT setApprovalForAll popup: ${e}`)
    }
  }

  // By default, the `Average` gas setting is used.
  if (gasSetting === 'Average') {
    await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()

    await handleNftSetApprovalForAll(notificationPage)

    return
  }

  // TODO: This button can be invisible in case of a network issue. Verify this, and handle in the future.
  await notificationPage.locator(Selectors.TransactionPage.editGasFeeMenu.editGasFeeButton).click()

  const handleSlowOrFastGasSetting = async (selector: string) => {
    await notificationPage.locator(selector).click()
  }

  if (gasSetting === 'Slow') {
    await handleSlowOrFastGasSetting(Selectors.TransactionPage.editGasFeeMenu.slowGasFeeButton)
  } else if (gasSetting === 'Fast') {
    await handleSlowOrFastGasSetting(Selectors.TransactionPage.editGasFeeMenu.fastGasFeeButton)
  }

  await notificationPage.locator(Selectors.TransactionPage.editGasFeeMenu.saveButton).click()

  await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()

  await handleNftSetApprovalForAll(notificationPage)
}

const confirmTransactionAndWaitForMining = async (walletPage: Page, notificationPage: Page, options: GasSettings) => {
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

  await confirmTransaction(notificationPage, options)

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
  await notificationPage.locator(Selectors.ActionFooter.cancelActionButton).click()
}

export const transaction = {
  confirm: confirmTransaction,
  reject: rejectTransaction,
  confirmAndWaitForMining: confirmTransactionAndWaitForMining
}
