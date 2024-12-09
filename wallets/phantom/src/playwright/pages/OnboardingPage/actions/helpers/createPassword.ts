import type { Page } from '@playwright/test'
import Selectors from '../../../../../selectors/pages/OnboardingPage'

const StepSelectors = Selectors.SecretRecoveryPhrasePageSelectors.passwordStep

export async function createPassword(page: Page, password: string) {
  await page.locator(StepSelectors.passwordInput).fill(password)
  await page.locator(StepSelectors.confirmPasswordInput).fill(password)

  // Using `locator.click()` instead of `locator.check()` as a workaround due to dynamically appearing elements.
  await page.locator(StepSelectors.acceptTermsCheckbox).click()

  await page.locator(StepSelectors.continue).click()
}
