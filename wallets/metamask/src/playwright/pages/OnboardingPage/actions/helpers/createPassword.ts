import type { Page } from "@playwright/test";
import Selectors from "../../../../../selectors/pages/OnboardingPage";

const StepSelectors = Selectors.SecretRecoveryPhrasePageSelectors.passwordStep;

export async function createPassword(page: Page, password: string) {
  await page.locator(StepSelectors.passwordInput).type(password, { delay: 20 });
  await page
    .locator(StepSelectors.confirmPasswordInput)
    .type(password, { delay: 20 });
  await page.locator(StepSelectors.acceptTermsCheckbox).click();
  await page.locator(StepSelectors.importWalletButton).click();
}
