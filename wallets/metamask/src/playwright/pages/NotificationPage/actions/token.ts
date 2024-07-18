import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/NotificationPage'

async function addNew(notificationPage: Page) {
  await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()
}

export const token = {
  addNew
}
