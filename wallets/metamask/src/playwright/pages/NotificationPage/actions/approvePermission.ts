import type { Page } from '@playwright/test'
import Selectors from '../selectors'
import { type GasSetting, transaction } from './transaction'

const editTokenPermission = async (notificationPage: Page, customSpendLimit: 'max' | number) => {
  if (customSpendLimit === 'max') {
    await notificationPage.locator(Selectors.PermissionPage.approve.maxButton).click()
    return
  }

  await notificationPage
    .locator(Selectors.PermissionPage.approve.customSpendingCapInput)
    .fill(customSpendLimit.toString())
}

const approveTokenPermission = async (notificationPage: Page, gasSetting: GasSetting) => {
  // Click the "Next" button.
  await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()

  // Approve flow is identical to the confirm transaction flow after we click the "Next" button.
  await transaction.confirm(notificationPage, gasSetting)
}

const rejectTokenPermission = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.ActionFooter.rejectActionButton).click()
}

export const approvePermission = {
  editTokenPermission,
  approve: approveTokenPermission,
  reject: rejectTokenPermission
}
