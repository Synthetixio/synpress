import type { Page } from '@playwright/test'
import Selectors from '../selectors'

const confirmTransaction = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.TransactionPage.confirmButton).click()
}

const rejectTransaction = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.TransactionPage.rejectButton).click()
}

export const transaction = {
  confirm: confirmTransaction,
  reject: rejectTransaction
}
