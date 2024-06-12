import type { Page } from '@playwright/test'
export type Keplr = 'keplr'

export class KeplrWallet {
  seedPhrase = ''
  wallet: Keplr = 'keplr'
  retries: number
  browser: any
  mainWindow: any
  keplrWindow: any
  keplrNotification: any
  activeTabName: string
  extensionData: any
  

  constructor(
    readonly page: Page
  ) {
    this.page = page
    this.browser = undefined
    this.mainWindow = undefined
    this.keplrWindow = undefined
    this.keplrNotification = undefined
    this.activeTabName = undefined
    this.extensionData = undefined
    this.retries = 0
  }

  /**
   * Imports wallet from secret phrase and password.
   *
   * @param secretWords. The secret words to import.
   * @param password. The password to set.
   * 
   * @returns true if the wallet was imported successfully.
   */
  async importWallet(secretWords, password) {
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
    playwrightInstance,
    { secretWordsOrPrivateKey, password },
  ) {
    if (playwrightInstance) {
      await playwright.init(playwrightInstance);
    } else {
      await playwright.init();
    }

    await playwright.assignWindows();
    await playwright.assignActiveTabName('keplr');
    await module.exports.getExtensionDetails();
    await module.exports.importWallet(secretWordsOrPrivateKey, password);
  }
}
