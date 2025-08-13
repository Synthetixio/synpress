import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/PromptPage'

const signMessage = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()
}

const rejectMessage = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.ActionFooter.cancelActionButton).click()
}

export const signSimpleMessage = {
  sign: signMessage,
  reject: rejectMessage
}
