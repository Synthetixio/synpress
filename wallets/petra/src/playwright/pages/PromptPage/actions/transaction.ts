import type { Page } from '@playwright/test'
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

const rejectTransaction = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.ActionFooter.cancelActionButton).click()
}

export const transaction = {
  confirm: confirmTransaction,
  reject: rejectTransaction
}
