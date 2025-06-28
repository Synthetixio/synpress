import type { Page } from '@playwright/test'
import Selectors from '../../../../../selectors/pages/OnboardingPage'

const StepSelectors = Selectors.SecretRecoveryPhrasePageSelectors.passwordStep

export async function createPassword(page: Page, password: string) {
  await page.locator(StepSelectors.passwordInput).fill(password)
  await page.locator(StepSelectors.confirmPasswordInput).fill(password)

  // Using `locator.click()` here because we target the input label.
  await page.locator(StepSelectors.acceptTermsCheckbox).click()

  await page.locator(StepSelectors.continue).click()

  await page.getByRole('status').getByRole('button').click()

  await page.locator(StepSelectors.doneButton).click()
}
