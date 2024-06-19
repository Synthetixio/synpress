import { onboardingElements } from "../selectors";
import type { Page } from "@playwright/test";

export async function unlockWallet(page: Page, password: string) {
  await page.waitForLoadState('domcontentloaded');
  const passwordField = page.locator(onboardingElements.passwordInput);
  await passwordField.fill(password);
  const button = await page.$('button[type="submit"].sc-ciZhAO.kaxPjU');
  button?.click();
  return true;
}