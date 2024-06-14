// import { playwright } from "../../../playwright-kepler";
// import { onboardingElements } from "../selectors";
import type { Page } from "@playwright/test";

export async function importWallet(page: Page, secretWords: string, password: string) {

  await page.waitForSelector('button.submit-button');
  console.log(secretWords, password)
  // await playwright.waitAndClickByText(
  //   onboardingElements.createWalletButton,
  //   await playwright.keplrWindow(),
  // );
  // await playwright.waitAndClickByText(
  //   onboardingElements.importRecoveryPhraseButton,
  //   await playwright.keplrWindow(),
  // );
  // await playwright.waitAndClickByText(
  //   onboardingElements.useRecoveryPhraseButton,
  //   await playwright.keplrWindow(),
  // );
  // await playwright.waitAndClickByText(
  //   onboardingElements.phraseCount24,
  //   await playwright.keplrWindow(),
  // );

  // for (const [index, word] of secretWords.split(' ').entries()) {
  //   await playwright.waitAndTypeByLocator(
  //     onboardingElements.textAreaSelector,
  //     word,
  //     index,
  //   );
  // }

  // await playwright.waitAndClick(
  //   onboardingElements.submitPhraseButton,
  //   await playwright.keplrWindow(),
  // );

  // await playwright.waitAndType(
  //   onboardingElements.walletInput,
  //   onboardingElements.walletName,
  // );
  // await playwright.waitAndType(onboardingElements.passwordInput, password);
  // await playwright.waitAndType(
  //   onboardingElements.confirmPasswordInput,
  //   password,
  // );

  // await playwright.waitAndClick(
  //   onboardingElements.submitWalletDataButton,
  //   await playwright.keplrWindow(),
  //   { number: 1 },
  // );

  // await playwright.waitForByText(
  //   onboardingElements.phraseSelectChain,
  //   await playwright.keplrWindow(),
  // );

  // await playwright.waitAndClick(
  //   onboardingElements.submitChainButton,
  //   await playwright.keplrWindow(),
  // );

  // await playwright.waitForByText(
  //   onboardingElements.phraseAccountCreated,
  //   await playwright.keplrWindow(),
  // );

  // await playwright.waitAndClick(
  //   onboardingElements.finishButton,
  //   await playwright.keplrWindow(),
  //   { dontWait: true },
  // );

  // return true;
}
