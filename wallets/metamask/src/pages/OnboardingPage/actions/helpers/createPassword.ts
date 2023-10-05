import type { Page } from '@playwright/test'
import { SecretRecoveryPhrasePageSelectors } from '../../../../selectors'

const StepSelectors = SecretRecoveryPhrasePageSelectors.passwordStep

export async function createPassword(page: Page, password: string) {
  await page.locator(StepSelectors.passwordInput).fill(password)
  await page.locator(StepSelectors.confirmPasswordInput).fill(password)

  // Using `locator.click()` instead of `locator.check()` as a workaround due to dynamically appearing elements.
  await page.locator(StepSelectors.acceptTermsCheckbox).click()

  const importWalletButton = page.locator(StepSelectors.importWalletButton)

  if (await importWalletButton.isDisabled()) {
    const errorText = await page.locator(StepSelectors.error).textContent({
      timeout: 1000
    })

    throw new Error(`[CreatePassword] Invalid password. Error from MetaMask: ${errorText}`)
  }

  await importWalletButton.click()
}
