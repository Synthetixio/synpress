import type { Page } from '@playwright/test'
import Selectors from '../selectors'

export async function renameAccount(page: Page, newAccountName: string) {
  await page.locator(Selectors.accountMenu.accountButton).click()
  await page.locator(Selectors.accountMenu.renameAccountMenu.listItemButton).nth(0).click()
  await page.locator(Selectors.threeDotsMenu.accountDetailsButton).click()
  await page.locator(Selectors.accountMenu.renameAccountMenu.renameButton).click()
  await page.locator(Selectors.accountMenu.renameAccountMenu.renameInput).fill(newAccountName)
  await page.locator(Selectors.accountMenu.renameAccountMenu.confirmRenameButton).click()
}
