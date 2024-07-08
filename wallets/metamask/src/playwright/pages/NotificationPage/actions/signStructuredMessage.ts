import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/NotificationPage'

const signMessage = async (notificationPage: Page) => {
  const scrollDownButton = notificationPage.locator(Selectors.SignaturePage.structuredMessage.scrollDownButton)
  const signButton = notificationPage.locator(Selectors.ActionFooter.confirmActionButton)

  while (await signButton.isDisabled()) {
    await scrollDownButton.click()
  }

  await signButton.click()
}

const rejectMessage = async (notificationPage: Page) => {
  await notificationPage.locator(Selectors.ActionFooter.rejectActionButton).click()
}

// Used for:
// - `eth_signTypedData_v3`
// - `eth_signTypedData_v4`
export const signStructuredMessage = {
  sign: signMessage,
  reject: rejectMessage
}
