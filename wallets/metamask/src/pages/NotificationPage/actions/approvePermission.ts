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

const editTokenPermissionWithImprovedTokenAllowanceExperience = async (
  notificationPage: Page,
  customSpendLimit: 'default' | 'max' | number
) => {
  if (customSpendLimit === 'default') {
    await notificationPage.locator(Selectors.PermissionPage.improvedApprove.useDefaultButton).click()
    return
  }

  if (customSpendLimit === 'max') {
    await notificationPage.locator(Selectors.PermissionPage.improvedApprove.maxButton).click()
    return
  }

  await notificationPage
    .locator(Selectors.PermissionPage.improvedApprove.customSpendingCapInput)
    .fill(customSpendLimit.toString())
}

const approveTokenPermission = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.PermissionPage.approve.confirmButton).click()
}

const rejectTokenPermission = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.PermissionPage.approve.rejectButton).click()
}

export const approvePermission = {
  editSpendLimit: editTokenPermission,
  editSpendLimitWithImprovedTokenAllowanceExperience: editTokenPermissionWithImprovedTokenAllowanceExperience,
  approve: approveTokenPermission,
  reject: rejectTokenPermission
}
