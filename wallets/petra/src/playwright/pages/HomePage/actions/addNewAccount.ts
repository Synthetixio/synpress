import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'

export async function addNewAccount(page: Page) {
  await page.locator(Selectors.accountMenu.accountName).click()

  await page.locator(Selectors.accountMenu.addAccountMenu.addAccountButton).click()

  await page.locator(Selectors.accountMenu.addAccountMenu.createNewAccountButton).click()

  await page.locator(Selectors.accountMenu.addAccountMenu.createButton).click()

  await page.locator(Selectors.accountMenu.addAccountMenu.doneButton).click()
}
