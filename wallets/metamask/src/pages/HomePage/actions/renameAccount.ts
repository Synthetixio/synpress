import type { Page } from '@playwright/test'
import { z } from 'zod'
import Selectors from '../selectors'

// @todo, look into validation schema that's language agnostic for Metamask reserved words (""Account 1", "Account 2", etc.)
const Account = z.object({
  name: z.string().refine((value) => {
    return value.trim().length > 0
  }, 'Invalid account name')
})

export type Account = z.infer<typeof Account>

export async function renameAccount(page: Page, newAccountName: Account['name']) {
  Account.parse({ name: newAccountName })

  await page.locator(Selectors.accountMenu.accountButton).click()
  await page.locator(Selectors.accountMenu.renameAccountMenu.listItemButton).nth(0).click()
  await page.locator(Selectors.threeDotsMenu.accountDetailsButton).click()
  await page.locator(Selectors.accountMenu.renameAccountMenu.renameButton).click()
  await page.locator(Selectors.accountMenu.renameAccountMenu.renameInput).fill(newAccountName)
  await page.locator(Selectors.accountMenu.renameAccountMenu.confirmRenameButton).click()
}
