import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/NotificationPage'
import type { GasSettings } from '../../../../type/GasSettings'
import { transaction } from './transaction'

const editTokenPermission = async (notificationPage: Page, customSpendLimit: 'max' | number) => {
  if (customSpendLimit === 'max') {
    await notificationPage.locator(Selectors.PermissionPage.approve.maxButton).click()
    return
  }

  await notificationPage
    .locator(Selectors.PermissionPage.approve.customSpendingCapInput)
    .fill(customSpendLimit.toString())
}

const approveTokenPermission = async (notificationPage: Page, gasSetting: GasSettings) => {
  // Approve flow is identical to the confirm transaction flow after we click the "Next" button.
  await transaction.confirm(notificationPage, gasSetting)
}

const rejectTokenPermission = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.ActionFooter.cancelActionButton).click()
}

export const approvePermission = {
  editTokenPermission,
  approve: approveTokenPermission,
  reject: rejectTokenPermission
}
