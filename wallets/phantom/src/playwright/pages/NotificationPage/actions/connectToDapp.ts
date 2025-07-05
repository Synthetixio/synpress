import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/NotificationPage'
import { switchAccount } from '../../HomePage/actions'

async function confirmConnection(notificationPage: Page) {
  await notificationPage.locator(Selectors.ActionFooter.connectActionButton).click()
}

// By default, the last account will be selected. If you want to select a specific account, pass `account` parameter.
export async function connectToDapp(notificationPage: Page, account?: string) {
  if (account) {
    await switchAccount(notificationPage, account)
  }

  await confirmConnection(notificationPage)
}
