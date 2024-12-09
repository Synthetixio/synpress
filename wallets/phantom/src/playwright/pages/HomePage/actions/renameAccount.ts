import { type Page, expect } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'
import { allTextContents } from '../../../utils/allTextContents'

export async function renameAccount(page: Page, currentAccountName: string, newAccountName: string) {
  // TODO: Use zod to validate this.
  if (newAccountName.length === 0) {
    throw new Error('[RenameAccount] Account name cannot be an empty string')
  }

  await page.locator(Selectors.accountMenu.accountButton).click()

  const accountNamesLocators = await page.locator(Selectors.accountMenu.accountNames).all()

  const accountNames = await allTextContents(accountNamesLocators)

  const seekedAccountNames = accountNames.filter(
    (name) => name.toLocaleLowerCase() === currentAccountName.toLocaleLowerCase()
  )

  if (seekedAccountNames.length === 0) {
    throw new Error(`[SwitchAccount] Account with name ${currentAccountName} not found`)
  }

  await page.locator(Selectors.accountMenu.manageAccountsButton).click()

  await page.locator(Selectors.manageAccountButton(currentAccountName)).click()

  await page.locator(Selectors.editAccountMenu.accountNameButton).click()

  await page.locator(Selectors.accountMenu.addAccountMenu.addNewAccountMenu.accountNameInput).fill(newAccountName)

  await page.locator(Selectors.accountMenu.renameAccountMenu.saveButton).click()

  // Verify that account has been renamed
  await expect(page.locator(Selectors.editAccountMenu.accountNameButton)).toContainText(newAccountName)
}
