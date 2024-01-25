import type { Page } from '@playwright/test'
import Selectors from '../selectors'

export async function renameAccount(page: Page, newAccountName: string) {
  // TODO: Use zod to validate this.
  if (newAccountName.length === 0) {
    throw new Error('[renameAccount] Account name cannot be an empty string, or be reserved for another account.')
  }

  await page.locator(Selectors.accountMenu.accountButton).click()

  await page.locator(Selectors.accountMenu.renameAccountMenu.listItemButton).click()
  await page.locator(Selectors.accountMenu.renameAccountMenu.listItemDetails).click()
  await page.locator(Selectors.accountMenu.renameAccountMenu.renameButton).click()
  await page.locator(Selectors.accountMenu.renameAccountMenu.renameInput).fill(newAccountName)

  await page.locator(Selectors.accountMenu.renameAccountMenu.renameConfirmButton).click()
}
