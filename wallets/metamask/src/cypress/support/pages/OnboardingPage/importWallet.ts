
import { confirmSecretRecoveryPhrase, createPassword } from './helpers'
import { onboardingPage, homePage } from '../../../../selectors';
import { closePopover } from '../../../../playwright/pages/HomePage/actions';

export async function importWallet(seedPhrase: string, password: string) {
  cy.get(onboardingPage.GetStartedPageSelectors.termsOfServiceCheckbox).click()
  cy.get(onboardingPage.GetStartedPageSelectors.importWallet).click()

  cy.get(onboardingPage.AnalyticsPageSelectors.optOut).click()

  // Secret Recovery Phrase Page
  // await confirmSecretRecoveryPhrase(page, seedPhrase)
  // await createPassword(page, password)

  cy.get(onboardingPage.WalletCreationSuccessPageSelectors.confirmButton).click()

  cy.get(onboardingPage.PinExtensionPageSelectors.nextButton).click()
  cy.get(onboardingPage.PinExtensionPageSelectors.confirmButton).click()

  // closePopover(page)

  // verifyImportedWallet(page)
}

// Checks if the wallet was imported successfully.
// On rare occasions, the MetaMask hangs during the onboarding process.
async function verifyImportedWallet(page: Page) {
  const accountAddress = await cy.get(homePage.copyAccountAddressButton).textContent()

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
