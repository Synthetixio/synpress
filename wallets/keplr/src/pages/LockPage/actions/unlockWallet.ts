import { onboardingElements } from "../selectors";
import type { Page } from "@playwright/test";

export async function unlockWallet(page: Page, password: string) {
  await page.waitForLoadState('domcontentloaded');
  const passwordField = page.locator(onboardingElements.unlockPasswordInput);
  await passwordField.fill(password);
  const button = await page.$(onboardingElements.unlockConfirmPasswordInput);
  button?.click();
  return true;
}