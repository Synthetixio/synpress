import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/PromptPage'

async function closeWarning(notificationPage: Page) {
  await notificationPage.locator(Selectors.ActionFooter.closeActionButton).click()
}

export async function closeUnsupportedNetworkWarning(notificationPage: Page) {
  await closeWarning(notificationPage)
}
