import { expect, type Page } from '@playwright/test'
import Selectors from '../../../../selectors/pages/HomePage'
import { confirmSecretRecoveryPhrase } from '../../OnboardingPage/actions/helpers'

export async function importWalletFromMnemonicPhrase(page: Page, seedPhrase: string) {
  const accountButton = page.locator(Selectors.accountMenu.accountName)
  await expect(accountButton).toBeVisible()
  await accountButton.click()

  await expect(page.locator(Selectors.accountMenu.addAccountMenu.addAccountButton)).toBeVisible()
  await page.locator(Selectors.accountMenu.addAccountMenu.addAccountButton).click()
  await page.locator(Selectors.accountMenu.addAccountMenu.importAccountMnemonicButton).click()

  await confirmSecretRecoveryPhrase(page, seedPhrase)

  await page.locator(Selectors.accountMenu.addAccountMenu.importAccountMenu.importButton).click()
}
