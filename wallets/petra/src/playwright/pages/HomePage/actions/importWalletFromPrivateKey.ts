import { type Page, expect } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'

export async function importWalletFromPrivateKey(page: Page, privateKey: string) {
  const accountButton = page.locator(Selectors.accountMenu.accountName)
  await expect(accountButton).toBeVisible()
  await accountButton.click()

  await expect(page.locator(Selectors.accountMenu.addAccountMenu.addAccountButton)).toBeVisible()
  await page.locator(Selectors.accountMenu.addAccountMenu.addAccountButton).click()

  await page.locator(Selectors.accountMenu.addAccountMenu.importAccountPrivateKeyButton).click()

  await page.locator(Selectors.accountMenu.addAccountMenu.importAccountMenu.privateKeyInput).fill(privateKey)

  await page.locator(Selectors.accountMenu.addAccountMenu.importAccountMenu.importButton).click()
}
