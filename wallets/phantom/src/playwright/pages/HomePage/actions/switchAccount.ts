import { type Locator, type Page, expect } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'
import { allTextContents } from '../../../utils/allTextContents'

export async function switchAccount(page: Page, accountName: string) {
  await page.locator(Selectors.accountMenu.accountButton).click()

  let accountNamesLocators: Locator[] = []
  let accountNames: string[] = []

  await expect(async () => {
    accountNamesLocators = await page.locator(Selectors.accountMenu.accountNames).all()

    accountNames = await allTextContents(accountNamesLocators)

    expect(accountNames.length).toBeGreaterThan(0)
  }).toPass()

  const seekedAccountNames = accountNames.filter((name) => name.toLocaleLowerCase() === accountName.toLocaleLowerCase())

  if (seekedAccountNames.length === 0) {
    throw new Error(`[SwitchAccount] Account with name ${accountName} not found`)
  }

  // biome-ignore lint/style/noNonNullAssertion: this non-null assertion is intentional
  const accountIndex = accountNames.indexOf(seekedAccountNames[0]!) // TODO: handle the undefined here better

  // biome-ignore lint/style/noNonNullAssertion: this non-null assertion is intentional
  await accountNamesLocators[accountIndex]!.click() // TODO: handle the undefined here better
}
