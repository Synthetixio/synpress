import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/NotificationPage'

const signMessage = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()
}

const rejectMessage = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.ActionFooter.cancelActionButton).click()
}

const signMessageWithRisk = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.SignaturePage.riskModal.proceedAnyway).click()
  await notificationPage.locator(Selectors.SignaturePage.riskModal.confirmUnsafe).click()
  await notificationPage.locator(Selectors.SignaturePage.riskModal.acknowledgeRisks).click()
  await notificationPage.locator(Selectors.SignaturePage.riskModal.reconfirmUnsafe).click()
}

export const signSimpleMessage = {
  sign: signMessage,
  reject: rejectMessage,
  signWithRisk: signMessageWithRisk
}
