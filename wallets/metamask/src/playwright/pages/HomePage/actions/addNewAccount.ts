import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'

export async function addNewAccount(page: Page, accountName: string) {
  // TODO: Use zod to validate this.
  if (accountName.length === 0) {
    throw new Error('[AddNewAccount] Account name cannot be an empty string')
  }

  await page.locator(Selectors.accountMenu.accountButton).click()

  await page.locator(Selectors.accountMenu.addAccountMenu.addAccountButton).click()
  await page.locator(Selectors.accountMenu.addAccountMenu.addNewAccountButton).click()

  await page.locator(Selectors.accountMenu.addAccountMenu.addNewAccountMenu.accountNameInput).fill(accountName)

  await page.locator(Selectors.accountMenu.addAccountMenu.addNewAccountMenu.createButton).click()
}
