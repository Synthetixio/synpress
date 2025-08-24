import assert from 'node:assert'
import type { Page } from '@playwright/test'

import HomePageSelectors from '../../../../selectors/pages/HomePage'
import Selectors from '../../../../selectors/pages/OnboardingPage'

import { closeNewNetworkInfoPopover, closePopover, closeWhatsNewPopover } from '../../HomePage/actions'
import { confirmSecretRecoveryPhrase, createPassword } from './helpers'

export async function importWallet(page: Page, seedPhrase: string, password: string) {
  await page.locator(Selectors.GetStartedPageSelectors.termsOfServiceCheckbox).click()
  await page.locator(Selectors.GetStartedPageSelectors.importWallet).click()

  await page.locator(Selectors.AnalyticsPageSelectors.optOut).click()

  // Secret Recovery Phrase Page
  await confirmSecretRecoveryPhrase(page, seedPhrase)
  await createPassword(page, password)

  await page.locator(Selectors.WalletCreationSuccessPageSelectors.confirmButton).click()

  await page.locator(Selectors.PinExtensionPageSelectors.nextButton).click()
  await page.locator(Selectors.PinExtensionPageSelectors.confirmButton).click()

  // Close popovers in order from top to bottom (z-index order)
  await closeNewNetworkInfoPopover(page)
  await closePopover(page)
  await closeWhatsNewPopover(page)

  await verifyImportedWallet(page)
}

// Checks if the wallet was imported successfully.
// On rare occasions, the MetaMask hangs during the onboarding process.
async function verifyImportedWallet(page: Page) {
  const accountAddress = await page.locator(HomePageSelectors.copyAccountAddressButton).textContent()

  assert.strictEqual(
    accountAddress?.startsWith('0x'),
    true,
    new Error(
      [
        `Incorrect state after importing the seed phrase. Account address is expected to start with "0x", but got "${accountAddress}" instead.`,
        'Note: Try to re-run the cache creation. This is a known but rare error where MetaMask hangs during the onboarding process. If it persists, please file an issue on GitHub.'
      ].join('\n')
    )
  )
}
