import { type BrowserContext, type Page } from '@playwright/test'
import { playwright } from './playwright-kepler'
import { onboardingElements } from './pages/LockPage/selectors/index'
import { notificationPageElements } from './pages/NotificationPage/selectors/index'
import { LockPage } from './pages/LockPage/page'

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
    console.log('im', 1, playwright)
    await playwright.waitAndClickByText(
      onboardingElements.createWalletButton,
      await playwright.keplrWindow(),
    );
    console.log('im', 2)
    await playwright.waitAndClickByText(
      onboardingElements.importRecoveryPhraseButton,
      await playwright.keplrWindow(),
    );
    console.log('im', 3)
    await playwright.waitAndClickByText(
      onboardingElements.useRecoveryPhraseButton,
      await playwright.keplrWindow(),
    );
    console.log('im', 4)
    await playwright.waitAndClickByText(
      onboardingElements.phraseCount24,
      await playwright.keplrWindow(),
    );
    console.log('im', 5)
    for (const [index, word] of secretWords.split(' ').entries()) {
      await playwright.waitAndTypeByLocator(
        onboardingElements.textAreaSelector,
        word,
        index,
      );
    }
    console.log('im', 6)
    await playwright.waitAndClick(
      onboardingElements.submitPhraseButton,
      await playwright.keplrWindow(),
    );
    console.log('im', 7)
    await playwright.waitAndType(
      onboardingElements.walletInput,
      onboardingElements.walletName,
    );
    console.log('im', 8)
    await playwright.waitAndType(onboardingElements.passwordInput, password);
    await playwright.waitAndType(
      onboardingElements.confirmPasswordInput,
      password,
    );
    console.log('im', 9)
    await playwright.waitAndClick(
      onboardingElements.submitWalletDataButton,
      await playwright.keplrWindow(),
      { number: 1 },
    );
    console.log('im', 10)
    await playwright.waitForByText(
      onboardingElements.phraseSelectChain,
      await playwright.keplrWindow(),
    );
    console.log('im', 11)
    await playwright.waitAndClick(
      onboardingElements.submitChainButton,
      await playwright.keplrWindow(),
    );
    console.log('im', 12)
    await playwright.waitForByText(
      onboardingElements.phraseAccountCreated,
      await playwright.keplrWindow(),
    );
    console.log('im', 13)
    await playwright.waitAndClick(
      onboardingElements.finishButton,
      await playwright.keplrWindow(),
      { dontWait: true },
    );
    console.log('im', 14)
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
    page: any,
    { secretWordsOrPrivateKey, password }: { secretWordsOrPrivateKey: string; password: string },
  ) {
    const lockpage = new LockPage(page)
    const wallet = await lockpage.unlock(secretWordsOrPrivateKey, password)
    return wallet;
  }
}
