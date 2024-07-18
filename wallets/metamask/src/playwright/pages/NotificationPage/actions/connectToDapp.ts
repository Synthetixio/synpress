import type { Locator, Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/NotificationPage'
import { allTextContents } from '../../../utils/allTextContents'

async function selectAccounts(accountsToSelect: string[], accountLocators: Locator[], availableAccountNames: string[]) {
  for (const account of accountsToSelect) {
    const accountNameIndex = availableAccountNames.findIndex((name) => name.startsWith(account))
    if (accountNameIndex < 0) throw new Error(`[ConnectToDapp] Account with name ${account} not found`)
    await accountLocators[accountNameIndex]?.locator(Selectors.ConnectPage.accountCheckbox).check()
  }
}

async function connectMultipleAccounts(notificationPage: Page, accounts: string[]) {
  // Wait for the accounts to be loaded as 'all()' doesnt not wait for the results - https://playwright.dev/docs/api/class-locator#locator-all
  // Additionally disable default account to reuse necessary delay
  await notificationPage
    .locator(Selectors.ConnectPage.accountOption)
    .locator(Selectors.ConnectPage.accountCheckbox)
    .last()
    .setChecked(false)

  const accountLocators = await notificationPage.locator(Selectors.ConnectPage.accountOption).all()
  const accountNames = await allTextContents(accountLocators)

  await selectAccounts(accounts, accountLocators, accountNames)
}

async function confirmConnection(notificationPage: Page) {
  // Click `Next`
  await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()
  // Click `Connect`
  await notificationPage.locator(Selectors.ActionFooter.confirmActionButton).click()
}

// By default, only the last account will be selected. If you want to select a specific account, pass `accounts` parameter.
export async function connectToDapp(notificationPage: Page, accounts?: string[]) {
  if (accounts && accounts.length > 0) {
    await connectMultipleAccounts(notificationPage, accounts)
  }

  await confirmConnection(notificationPage)
}
