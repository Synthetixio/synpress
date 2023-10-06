import type { Page } from '@playwright/test'
import {
  AnalyticsPageSelectors,
  GetStartedPageSelectors,
  PinExtensionPageSelectors,
  WalletCreationSuccessPageSelectors
} from '../../../selectors'
import { confirmSecretRecoveryPhrase, createPassword } from './helpers'

export async function importWallet(page: Page, seedPhrase: string, password: string) {
  await page.locator(GetStartedPageSelectors.importWallet).click()

  await page.locator(AnalyticsPageSelectors.optOut).click()

  // Secret Recovery Phrase Page
  await confirmSecretRecoveryPhrase(page, seedPhrase)
  await createPassword(page, password)

  await page.locator(WalletCreationSuccessPageSelectors.confirmButton).click()

  await page.locator(PinExtensionPageSelectors.nextButton).click()
  await page.locator(PinExtensionPageSelectors.confirmButton).click()
}
