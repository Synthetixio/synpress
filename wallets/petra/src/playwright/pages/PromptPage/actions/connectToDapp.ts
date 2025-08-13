import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/PromptPage'
import { switchAccount } from '../../HomePage/actions'

async function confirmConnection(page: Page) {
  await page.locator(Selectors.ActionFooter.confirmActionButton).click()
}

// By default, the last account will be selected. If you want to select a specific account, pass `account` parameter.
export async function connectToDapp(page: Page, account?: string) {
  if (account) {
    await switchAccount(page, account)
  }

  await confirmConnection(page)
}
