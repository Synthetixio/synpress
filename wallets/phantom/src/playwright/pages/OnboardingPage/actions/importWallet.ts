// import assert from "node:assert";
import { type Page, expect } from '@playwright/test'

// import HomePageSelectors from "../../../../selectors/pages/HomePage";
import Selectors from '../../../../selectors/pages/OnboardingPage'

// import { closePopover } from "../../HomePage/actions";
import { confirmSecretRecoveryPhrase, createPassword } from './helpers'

export async function importWallet(page: Page, seedPhrase: string, password: string) {
  await page.locator(Selectors.GetStartedPageSelectors.importWallet).click()

  await page.locator(Selectors.GetStartedPageSelectors.importRecoveryPhraseButton).click()

  await confirmSecretRecoveryPhrase(page, seedPhrase)

  await expect(
    page.locator(Selectors.SecretRecoveryPhrasePageSelectors.viewAccountsButton),
    'Import accounts success screen should be visible'
  ).toBeVisible({ timeout: 10_000 })

  await page.locator(Selectors.SecretRecoveryPhrasePageSelectors.continueButton).click()

  await createPassword(page, password)

  await expect(
    page.locator(Selectors.SecretRecoveryPhrasePageSelectors.allDone),
    'All Done success screen should be visible'
  ).toBeVisible({ timeout: 10_000 })

  // TO DO !!!!!!
  // await verifyImportedWallet(page);
}

// // Checks if the wallet was imported successfully.
// // On rare occasions, the Phantom hangs during the onboarding process.
// async function verifyImportedWallet(page: Page) {
//   const accountAddress = await page
//     .locator(HomePageSelectors.copyAccountAddressButton)
//     .textContent();

//   assert.strictEqual(
//     accountAddress?.startsWith("0x"),
//     true,
//     new Error(
//       [
//         `Incorrect state after importing the seed phrase. Account address is expected to start with "0x", but got "${accountAddress}" instead.`,
//         "Note: Try to re-run the cache creation. This is a known but rare error where Phantom hangs during the onboarding process. If it persists, please file an issue on GitHub.",
//       ].join("\n")
//     )
//   );
// }
