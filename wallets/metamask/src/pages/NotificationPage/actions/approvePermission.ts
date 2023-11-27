import type { Page } from '@playwright/test'
import Selectors from '../selectors'

const editTokenPermission = async (notificationPage: Page, customSpendLimit: 'max' | number) => {
  if (customSpendLimit === 'max') {
    await notificationPage.locator(Selectors.PermissionPage.approve.maxButton).click()
    return
  }

  await notificationPage
    .locator(Selectors.PermissionPage.approve.customSpendingCapInput)
    .fill(customSpendLimit.toString())
}

const approveTokenPermission = async (notificationPage: Page) => {
  // Click the "Next" button.
  await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()

  // Click the "Confirm" button.
  await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()
}

const rejectTokenPermission = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.ActionFooter.rejectActionButton).click()
}

export const approvePermission = {
  editTokenPermission,
  approve: approveTokenPermission,
  reject: rejectTokenPermission
}
