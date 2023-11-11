import type { BrowserContext } from '@playwright/test'
import { getNotificationPageAndWaitForLoad } from '../../../utils/getNotificationPageAndWaitForLoad'
import Selectors from '../selectors'

const signMessage = async (context: BrowserContext, extensionId: string) => {
  const notificationPage = await getNotificationPageAndWaitForLoad(context, extensionId)

  await notificationPage.locator(Selectors.SignaturePage.signButton).click()
}

const rejectMessage = async (context: BrowserContext, extensionId: string) => {
  const notificationPage = await getNotificationPageAndWaitForLoad(context, extensionId)

  await notificationPage.locator(Selectors.SignaturePage.rejectButton).click()
}

// Used for:
// - `personal_sign`
// - `eth_signTypedData`
export const signSimpleMessage = {
  sign: signMessage,
  reject: rejectMessage
}
