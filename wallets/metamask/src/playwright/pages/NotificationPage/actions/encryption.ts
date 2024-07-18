import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/NotificationPage'

export async function providePublicEncryptionKey(notificationPage: Page) {
  await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()
}

export async function decryptMessage(notificationPage: Page) {
  await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()
}
