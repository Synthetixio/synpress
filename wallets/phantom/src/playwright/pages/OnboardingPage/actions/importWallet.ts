import { type Page, expect } from '@playwright/test'
import Selectors from '../../../../selectors/pages/OnboardingPage'
import { confirmSecretRecoveryPhrase, createPassword } from './helpers'

export async function importWallet(page: Page, seedPhrase: string, password: string) {
  await page.locator(Selectors.GetStartedPageSelectors.importWallet).click()

  await page.locator(Selectors.GetStartedPageSelectors.importRecoveryPhraseButton).click()

  await confirmSecretRecoveryPhrase(page, seedPhrase)

  await expect(
    page.locator(Selectors.SecretRecoveryPhrasePageSelectors.viewAccountsButton),
    'Import accounts success screen should be visible'
  ).toBeVisible({ timeout: 60_000 })

  await page.locator(Selectors.SecretRecoveryPhrasePageSelectors.continueButton).click()

  await createPassword(page, password)

  await expect(
    page.locator(Selectors.SecretRecoveryPhrasePageSelectors.allDone),
    'All Done success screen should be visible'
  ).toBeVisible({ timeout: 10_000 })
}
