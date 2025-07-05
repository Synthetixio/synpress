import { type Page, expect } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'
import { z } from 'zod'

export async function renameAccount(page: Page, newAccountName: string) {
  const parsedNewAccountName = z.string().min(1, 'Account name cannot be an empty string').parse(newAccountName)

  await page.getByRole('link', { name: /account settings/i }).click()

  await page.locator('div.css-oj1c81 > button').click()

  await page.locator('input[name="name"]').fill(parsedNewAccountName)
  await page.locator('button[type="submit"]:has-text("Save")').click()

  // Verify that account has been renamed
  await expect(page.locator(Selectors.accountMenu.accountName)).toContainText(parsedNewAccountName)
}
