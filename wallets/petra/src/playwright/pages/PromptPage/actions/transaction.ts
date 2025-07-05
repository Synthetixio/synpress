import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/PromptPage'

const confirmTransaction = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()
}

const rejectTransaction = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.ActionFooter.cancelActionButton).click()
}

export const transaction = {
  confirm: confirmTransaction,
  reject: rejectTransaction
}
