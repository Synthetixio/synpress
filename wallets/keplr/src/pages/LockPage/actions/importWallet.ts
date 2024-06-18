import { onboardingElements } from "../selectors";
import type { Page } from "@playwright/test";

export async function importWallet(page: Page, secretWords: string, password: string) {
  await page.waitForLoadState('domcontentloaded');

  const importButton = await page.getByText(onboardingElements.importRecoveryPhraseButton);

  await importButton.click();
  const useButton = await page.getByText(onboardingElements.useRecoveryPhraseButton);
  await useButton.click();
  const phraseCount = await page.getByText(onboardingElements.phraseCount24);
  await phraseCount.click();
  const wordsArray = secretWords.split(' ');
  const inputFields = page.locator(onboardingElements.phraseInput);
  const inputCount = await inputFields.count();
  for (let i = 0; i < inputCount; i++) {
    const inputField = inputFields.nth(i);
    if (wordsArray[i]){
      await inputField.fill(wordsArray[i]!);
    }
  }
  const submitPhraseButton = await page.getByRole('button', { name: 'Import', exact: true });
  await submitPhraseButton.click();
  const walletInput = await page.locator(onboardingElements.walletInput);
  await walletInput.fill(onboardingElements.walletName);
  const passwordInput = await page.locator(onboardingElements.passwordInput);
  await passwordInput.fill(password);
  const confirmPasswordInput = await page.locator(onboardingElements.confirmPasswordInput);
  await confirmPasswordInput.fill(password);
  const submitWalletDataButton = await page.getByRole('button', { name: 'Next', exact: true });
  await submitWalletDataButton.click();
  const submitChainButton = await page.getByRole('button', { name: 'Save', exact: true });
  await submitChainButton.click();
  await page.close();
} 

