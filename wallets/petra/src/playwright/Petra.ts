import type { BrowserContext, Page } from '@playwright/test'
import { PetraAbstract } from '../type/PetraAbstract'
import { HomePage, PromptPage, OnboardingPage, UnlockPage } from './pages'
import type { NetworkMode } from '../type/Networks'

const NO_EXTENSION_ID_ERROR = new Error('Petra extensionId is not set')

/**
 * Phantom class for interacting with the Phantom extension in Playwright tests.
 *
 * This class provides methods to perform various operations on the Phantom extension,
 * such as importing wallets, switching networks, confirming transactions, and more.
 *
 * @class
 * @extends PetraAbstract
 */
export class Petra extends PetraAbstract {
  /**
   * This property can be used to access selectors for the onboarding page.
   *
   * @public
   * @readonly
   */
  readonly onboardingPage: OnboardingPage

  /**
   * This property can be used to access selectors for the lock page.
   *
   * @public
   * @readonly
   */
  readonly unlockPage: UnlockPage

  /**
   * This property can be used to access selectors for the home page.
   *
   * @public
   * @readonly
   */
  readonly homePage: HomePage

  /**
   * This property can be used to access selectors for the notification page.
   *
   * @public
   * @readonly
   */
  readonly promptPage: PromptPage

  /**
   * Creates an instance of Phantom.
   *
   * @param context - The Playwright BrowserContext in which the Phantom extension is running.
   * @param page - The Playwright Page object representing the Phantom extension's main page.
   * @param password - The password for the Phantom wallet.
   * @param extensionId - The ID of the Phantom extension. Optional if no interaction with dapps is required.
   */
  constructor(
    readonly context: BrowserContext,
    readonly page: Page,
    override readonly password: string,
    override readonly extensionId?: string
  ) {
    super(password, extensionId)

    this.onboardingPage = new OnboardingPage(page)
    this.unlockPage = new UnlockPage(page)
    this.homePage = new HomePage(page)
    this.promptPage = new PromptPage(page)
  }

  /**
   * Imports a wallet using the given seed phrase.
   *
   * @param seedPhrase - The seed phrase to import.
   */
  async importWallet(seedPhrase: string): Promise<void> {
    await this.onboardingPage.importWallet(seedPhrase, this.password)
  }

  /**
   * Adds a new account with the given name.
   *
   * @param accountName - The name for the new account.
   */
  async addNewAccount(accountName: string): Promise<void> {
    await this.homePage.addNewAccount()
    await this.homePage.renameAccount(accountName)
  }

  /**
   * Renames the currently selected account.
   *
   * @param currentAccountName - The current account name.
   * @param newAccountName - The new name for the account.
   */
  async renameAccount(newAccountName: string): Promise<void> {
    await this.homePage.renameAccount(newAccountName)
  }

  /**
   * Imports a wallet using the given private key.
   * @param privateKey - The private key to import.
   */
  async importWalletFromPrivateKey(privateKey: string): Promise<void> {
    await this.homePage.importWalletFromPrivateKey(privateKey)
  }

  /**
   * Imports a wallet using the given Mnemonic Phrase.
   * @param seedPhrase - The private key to import.
   */
  async importWalletFromMnemonicPhrase(seedPhrase: string): Promise<void> {
    await this.homePage.importWalletFromMnemonicPhrase(seedPhrase)
  }

  /**
   * Switches to the account with the given name.
   *
   * @param accountName - The name of the account to switch to.
   */
  async switchAccount(accountName: string): Promise<void> {
    await this.homePage.switchAccount(accountName)
  }

  /**
   * Gets the address of the currently selected account.
   *
   * @param network - Network that the address belongs to.
   * @returns The account address.
   */
  async getAccountAddress(): Promise<string> {
    return await this.homePage.getAccountAddress()
  }

  /**
   * Connects Phantom to a dapp.
   *
   * @param accounts - Optional array of account addresses to connect.
   * @throws {Error} If extensionId is not set.
   */
  async connectToDapp(account?: string): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.promptPage.connectToDapp(this.extensionId, account)
  }

  /**
   * Get's the prompt popup. This is useful for situations where simulated transactions fail
   * and we need to assert that the "Confirm" button is not disabled due to an error during the
   * simulation of the transaction.
   */
  async getPromptPage(): Promise<Page> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    return await this.promptPage.getPromptPage(this.extensionId)
  }

  /**
   * Locks the Phantom wallet.
   */
  async lock(): Promise<void> {
    await this.homePage.lock()
  }

  /**
   * Unlocks the Phantom wallet.
   */
  async unlock(): Promise<void> {
    await this.unlockPage.unlock(this.password)
  }

  /**
   * Confirms a signature request.
   *
   * @throws {Error} If extensionId is not set.
   */
  async confirmSignature(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.promptPage.signMessage(this.extensionId)
  }

  /**
   * Rejects a signature request.
   *
   * @throws {Error} If extensionId is not set.
   */
  async rejectSignature(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.promptPage.rejectMessage(this.extensionId)
  }

  /**
   * Confirms a transaction.
   *
   * @param options - Optional gas settings for the transaction.
   * @throws {Error} If extensionId is not set.
   */
  async confirmTransaction(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.promptPage.confirmTransaction(this.extensionId)
  }

  /**
   * Rejects a transaction.
   *
   * @throws {Error} If extensionId is not set.
   */
  async rejectTransaction(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.promptPage.rejectTransaction(this.extensionId)
  }

  /**
   * Navigates to the home page or wallet dashboard.
   */
  async goToHomePage(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.homePage.goToHomePage(this.extensionId)
  }

  /**
   * Navigates back to the home page.
   */
  async goBackToHomePage(): Promise<void> {
    await this.homePage.goBackToHomePage()
  }

  /**
   * Opens the settings page.
   */
  async openSettings(): Promise<void> {
    await this.homePage.openSettings()
  }

  /**
   * Toggles the display of test networks.
   */
  async toggleNetworkMode(networkMode: NetworkMode): Promise<void> {
    await this.homePage.toggleNetworkMode(networkMode)
  }
}
