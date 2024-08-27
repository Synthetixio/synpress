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

  // By default, the `site` gas setting is used.
  if (gasSetting === 'site') {
    await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()

    await handleNftSetApprovalForAll(notificationPage)

    return
  }

  // TODO: This button can be invisible in case of a network issue. Verify this, and handle in the future.
  await notificationPage.locator(Selectors.TransactionPage.editGasFeeMenu.editGasFeeButton).click()

  const estimationNotAvailableErrorMessage = (gasSetting: string) =>
    `[ConfirmTransaction] Estimated fee is not available for the "${gasSetting}" gas setting. By default, MetaMask would use the "site" gas setting in this case, however, this is not YOUR intention.`

  const handleLowMediumOrAggressiveGasSetting = async (
    gasSetting: string,
    selectors: { button: string; maxFee: string }
  ) => {
    if ((await notificationPage.locator(selectors.maxFee).textContent()) === '--') {
      throw new Error(estimationNotAvailableErrorMessage(gasSetting))
    }

    await notificationPage.locator(selectors.button).click()
  }

  if (gasSetting === 'low') {
    await handleLowMediumOrAggressiveGasSetting(gasSetting, Selectors.TransactionPage.editGasFeeMenu.lowGasFee)
  } else if (gasSetting === 'market') {
    await handleLowMediumOrAggressiveGasSetting(gasSetting, Selectors.TransactionPage.editGasFeeMenu.marketGasFee)
  } else if (gasSetting === 'aggressive') {
    await handleLowMediumOrAggressiveGasSetting(gasSetting, Selectors.TransactionPage.editGasFeeMenu.aggressiveGasFee)
  } else {
    await notificationPage.locator(Selectors.TransactionPage.editGasFeeMenu.advancedGasFeeButton).click()

    await notificationPage.locator(Selectors.TransactionPage.editGasFeeMenu.advancedGasFeeMenu.maxBaseFeeInput).fill('')
    await notificationPage
      .locator(Selectors.TransactionPage.editGasFeeMenu.advancedGasFeeMenu.maxBaseFeeInput)
      .fill(gasSetting.maxBaseFee.toString())

    await notificationPage
      .locator(Selectors.TransactionPage.editGasFeeMenu.advancedGasFeeMenu.priorityFeeInput)
      .fill('')
    await notificationPage
      .locator(Selectors.TransactionPage.editGasFeeMenu.advancedGasFeeMenu.priorityFeeInput)
      .fill(gasSetting.priorityFee.toString())

    if (gasSetting.gasLimit) {
      await notificationPage
        .locator(Selectors.TransactionPage.editGasFeeMenu.advancedGasFeeMenu.gasLimitEditButton)
        .click()

      await notificationPage.locator(Selectors.TransactionPage.editGasFeeMenu.advancedGasFeeMenu.gasLimitInput).fill('')
      await notificationPage
        .locator(Selectors.TransactionPage.editGasFeeMenu.advancedGasFeeMenu.gasLimitInput)
        .fill(gasSetting.gasLimit.toString())

      const gasLimitErrorLocator = notificationPage.locator(
        Selectors.TransactionPage.editGasFeeMenu.advancedGasFeeMenu.gasLimitError
      )
      const isGasLimitErrorHidden = await waitFor(() => gasLimitErrorLocator.isHidden(), 1_000, false) // TODO: Extract & make configurable

      if (!isGasLimitErrorHidden) {
        const errorText = await gasLimitErrorLocator.textContent({
          timeout: 1_000 // TODO: Extract & make configurable
        })

        throw new Error(`[ConfirmTransaction] Invalid gas limit: ${errorText}`)
      }
    }

    await notificationPage.locator(Selectors.TransactionPage.editGasFeeMenu.advancedGasFeeMenu.saveButton).click()
  }

  // We wait until the tooltip is not visible anymore. This indicates a gas setting was changed.
  // Ideally, we would wait until the edit button changes its text, i.e., "Site" -> "Aggressive", however, this is not possible right now.
  // For some unknown reason, if the manual gas setting is too high (>1 ETH), the edit button displays "Site" instead of "Advanced" ¯\_(ツ)_/¯
  const waitForAction = async () => {
    const isTooltipVisible = await notificationPage
      .locator(Selectors.TransactionPage.editGasFeeMenu.editGasFeeButtonToolTip)
      .isVisible()

    return !isTooltipVisible
  }

  // TODO: Extract & make configurable
  await waitFor(waitForAction, 3_000, true)

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
  await notificationPage.locator(Selectors.ActionFooter.rejectActionButton).click()
}

export const transaction = {
  confirm: confirmTransaction,
  reject: rejectTransaction,
  confirmAndWaitForMining: confirmTransactionAndWaitForMining
}
