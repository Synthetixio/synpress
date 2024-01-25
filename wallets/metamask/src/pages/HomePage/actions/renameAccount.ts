import type { Page } from '@playwright/test'
import Selectors from '../selectors'
import { z } from 'zod'

const Account = z.object({
  name: z.string().refine((value) => {
    return value.trim().length > 0 && !/^Account\s*\d+/.test(value);
  }, 'Invalid account name'),
})
export type Account = z.infer<typeof Account>

export async function renameAccount(page: Page, newAccountName: Account['name']) {
  Account.parse({ name: newAccountName }) // Validate newAccountName against Account schema

  await page.locator(Selectors.accountMenu.accountButton).click()

  await page.locator(Selectors.accountMenu.renameAccountMenu.listItemButton).click()
  await page.locator(Selectors.accountMenu.renameAccountMenu.listItemDetails).click()
  await page.locator(Selectors.accountMenu.renameAccountMenu.renameButton).click()
  await page.locator(Selectors.accountMenu.renameAccountMenu.renameInput).fill(newAccountName)

  await page.locator(Selectors.accountMenu.renameAccountMenu.renameConfirmButton).click()
}
