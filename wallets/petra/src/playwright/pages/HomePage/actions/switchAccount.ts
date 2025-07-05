import { type Locator, type Page, expect } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'
import { allTextContents } from '../../../utils/allTextContents'

export async function switchAccount(page: Page, accountName: string) {
  await page.locator(Selectors.accountMenu.accountName).click()

  let accountNamesLocators: Locator[] = []
  let accountNames: string[] = []

  await expect(async () => {
    accountNamesLocators = await page.locator(Selectors.accountMenu.accountNames).all()

    accountNames = await allTextContents(accountNamesLocators)

    expect(accountNames.length).toBeGreaterThan(0)
  }).toPass()

  const seekedAccountNames = accountNames.find((name) => name.toLocaleLowerCase() === accountName.toLocaleLowerCase())

  if (!seekedAccountNames) {
    throw new Error(`[SwitchAccount] Account with name ${accountName} not found`)
  }

  const accountIndex = accountNames.indexOf(seekedAccountNames)

  await accountNamesLocators[accountIndex]?.click()
}
