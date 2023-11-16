import type { Page } from '@playwright/test'
import Selectors from '../selectors'

const editTokenPermission = async (notificationPage: Page, customSpendLimit: number) => {
  await notificationPage.locator(Selectors.PermissionPage.approve.editPermission.editPermissionButton).click()

  await notificationPage.locator(Selectors.PermissionPage.approve.editPermission.customSpendLimitButton).click()

  await notificationPage
    .locator(Selectors.PermissionPage.approve.editPermission.customSpendLimitInput)
    .fill(customSpendLimit.toString())

  await notificationPage.locator(Selectors.PermissionPage.approve.editPermission.saveButton).click()
}

const approveTokenPermission = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.PermissionPage.approve.confirmButton).click()
}

const rejectTokenPermission = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.PermissionPage.approve.rejectButton).click()
}

export const approvePermission = {
  editSpendLimit: editTokenPermission,
  approve: approveTokenPermission,
  reject: rejectTokenPermission
}
