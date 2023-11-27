import type { Page } from '@playwright/test'
import Selectors from '../selectors'

export async function connectToDapp(notificationPage: Page) {
  // Click `Next`.
  await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()

  // Click `Connect`.
  await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()
}
