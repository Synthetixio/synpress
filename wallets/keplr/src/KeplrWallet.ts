import type { BrowserContext, Page } from '@playwright/test'
import { playwright } from './playwright-kepler'
import { onboardingElements } from './pages/LockPage/selectors/index'
import { notificationPageElements } from './pages/NotificationPage/selectors/index'

export class KeplrWallet {
  seedPhrase = ''
  retries: number
  browser: any
  mainWindow: any
  keplrWindow: any
  keplrNotification: any
  activeTabName: string | undefined
  extensionData: any
  extensionVersion: string | undefined

  constructor(
    readonly page: Page,
    readonly context: BrowserContext,
    readonly password: string,
    readonly extensionId: string | undefined,
  ) {
    this.page = page
    this.browser = undefined
    this.mainWindow = undefined
    this.keplrWindow = undefined
    this.keplrNotification = undefined
    this.activeTabName = undefined
    this.extensionData = undefined
    this.retries = 0
    this.extensionId = undefined
    this.extensionVersion = undefined
  }

  async getExtensionDetails() {
    // @ts-ignore
    const keplrExtensionData: any = (await playwright.getExtensionsData()).keplr;
    this.extensionVersion = keplrExtensionData.version;

    return {
      extensionId: keplrExtensionData.id,
      extensionVersion: this.extensionVersion,
    };
  }

  /**
   * Imports wallet from secret phrase and password.
   *
   * @param secretWords. The secret words to import.
   * @param password. The password to set.
   * 
   * @returns true if the wallet was imported successfully.
   */
  async importWallet(secretWords: string, password: string) {
    await playwright.waitAndClickByText(
      onboardingElements.createWalletButton,
      await playwright.keplrWindow(),
    );
    await playwright.waitAndClickByText(
      onboardingElements.importRecoveryPhraseButton,
      await playwright.keplrWindow(),
    );
    await playwright.waitAndClickByText(
      onboardingElements.useRecoveryPhraseButton,
      await playwright.keplrWindow(),
    );
    await playwright.waitAndClickByText(
      onboardingElements.phraseCount24,
      await playwright.keplrWindow(),
    );

    for (const [index, word] of secretWords.split(' ').entries()) {
      await playwright.waitAndTypeByLocator(
        onboardingElements.textAreaSelector,
        word,
        index,
      );
    }

    await playwright.waitAndClick(
      onboardingElements.submitPhraseButton,
      await playwright.keplrWindow(),
    );

    await playwright.waitAndType(
      onboardingElements.walletInput,
      onboardingElements.walletName,
    );
    await playwright.waitAndType(onboardingElements.passwordInput, password);
    await playwright.waitAndType(
      onboardingElements.confirmPasswordInput,
      password,
    );

    await playwright.waitAndClick(
      onboardingElements.submitWalletDataButton,
      await playwright.keplrWindow(),
      { number: 1 },
    );

    await playwright.waitForByText(
      onboardingElements.phraseSelectChain,
      await playwright.keplrWindow(),
    );

    await playwright.waitAndClick(
      onboardingElements.submitChainButton,
      await playwright.keplrWindow(),
    );

    await playwright.waitForByText(
      onboardingElements.phraseAccountCreated,
      await playwright.keplrWindow(),
    );

    await playwright.waitAndClick(
      onboardingElements.finishButton,
      await playwright.keplrWindow(),
      { dontWait: true },
    );

    return true;
  }

  /**
   * Adds a new account.
   *
   * @returns true if the account was added successfully.
   */
  async acceptAccess() {
    const notificationPage = await playwright.switchToKeplrNotification();
    await playwright.waitAndClick(
      notificationPageElements.approveButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  /**
   * Confirms a transaction.
   *
   * @returns true if the transaction was confirmed successfully.
   */
  async confirmTransaction() {
    const notificationPage = await playwright.switchToKeplrNotification();
    await playwright.waitAndClick(
      notificationPageElements.approveButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  /**
   * Does initial setup for the wallet.
   * 
   * @param playwrightInstance. The playwright instance to use.
   * @param secretWordsOrPrivateKey. The secret words or private key to import.
   * @param password. The password to set.
   */
  async setupWallet(
    playwrightInstance: any,
    { secretWordsOrPrivateKey, password }: { secretWordsOrPrivateKey: string; password: string },
  ) {
    if (playwrightInstance) {
      await playwright.init(playwrightInstance);
    }

    await playwright.assignWindows();
    await playwright.assignActiveTabName('keplr');
    await this.getExtensionDetails();
    await this.importWallet(secretWordsOrPrivateKey, password);
  }
}
