import type { Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'
import { allTextContents } from '../../../utils/allTextContents'

export async function renameAccount(page: Page, currentAccountName: string, newAccountName: string) {
  await page.locator(Selectors.accountMenu.accountButton).click()

  const accountNamesLocators = await page.locator(Selectors.accountMenu.accountNames).all()

  const accountNames = await allTextContents(accountNamesLocators)

  const seekedAccountNames = accountNames.filter(
    (name) => name.toLocaleLowerCase() === currentAccountName.toLocaleLowerCase()
  )

  if (seekedAccountNames.length === 0) {
    throw new Error(`[SwitchAccount] Account with name ${currentAccountName} not found`)
  }

  // biome-ignore lint/style/noNonNullAssertion: this non-null assertion is intentional
  const accountIndex = accountNames.indexOf(seekedAccountNames[0]!)

  await page.locator(Selectors.accountMenu.renameAccountMenu.listItemButton).nth(accountIndex).click()
  await page.locator(Selectors.threeDotsMenu.accountDetailsButton).click()
  await page.locator(Selectors.accountMenu.renameAccountMenu.renameButton).click()
  await page.locator(Selectors.accountMenu.renameAccountMenu.renameInput).fill(newAccountName)
  await page.locator(Selectors.accountMenu.renameAccountMenu.confirmRenameButton).click()
}
