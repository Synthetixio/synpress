import type { BrowserContext } from '@playwright/test'
import { getNotificationPage } from '../../../utils/getNotificationPage'
import Selectors from '../selectors'

const signPersonalMessage = async (context: BrowserContext, extensionId: string) => {
  const notificationPage = await getNotificationPage(context, extensionId)

  await notificationPage.locator(Selectors.SignaturePage.signButton).click()
}

const rejectPersonalMessage = async (context: BrowserContext, extensionId: string) => {
  const notificationPage = await getNotificationPage(context, extensionId)

  await notificationPage.locator(Selectors.SignaturePage.rejectButton).click()
}

export const personalSign = {
  sign: signPersonalMessage,
  reject: rejectPersonalMessage
}
