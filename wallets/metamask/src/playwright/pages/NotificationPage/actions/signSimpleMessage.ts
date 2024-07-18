import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/NotificationPage'

const signMessage = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()
}

const rejectMessage = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.ActionFooter.rejectActionButton).click()
}

const signMessageWithRisk = async (notificationPage: Page) => {
  await signMessage(notificationPage)

  await notificationPage.locator(Selectors.SignaturePage.riskModal.signButton).click()
}

export const signSimpleMessage = {
  sign: signMessage,
  reject: rejectMessage,
  signWithRisk: signMessageWithRisk
}
