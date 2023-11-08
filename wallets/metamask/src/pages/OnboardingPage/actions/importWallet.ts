import type { Page } from '@playwright/test'
import Selectors from '../selectors'
import { confirmSecretRecoveryPhrase, createPassword } from './helpers'

export async function importWallet(page: Page, seedPhrase: string, password: string) {
  await page.locator(Selectors.GetStartedPageSelectors.importWallet).click()

  await page.locator(Selectors.AnalyticsPageSelectors.optOut).click()

  // Secret Recovery Phrase Page
  await confirmSecretRecoveryPhrase(page, seedPhrase)
  await createPassword(page, password)

  await page.locator(Selectors.WalletCreationSuccessPageSelectors.confirmButton).click()

  await page.locator(Selectors.PinExtensionPageSelectors.nextButton).click()
  await page.locator(Selectors.PinExtensionPageSelectors.confirmButton).click()
}
