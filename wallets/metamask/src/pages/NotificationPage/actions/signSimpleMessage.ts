import type { Page } from '@playwright/test'
import Selectors from '../selectors'

const signMessage = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.SignaturePage.simpleMessage.signButton).click()
}

const rejectMessage = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.SignaturePage.simpleMessage.rejectButton).click()
}

// Used for:
// - `personal_sign`
// - `eth_signTypedData`
export const signSimpleMessage = {
  sign: signMessage,
  reject: rejectMessage
}
