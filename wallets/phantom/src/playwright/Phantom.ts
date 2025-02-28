import type { BrowserContext, Page } from '@playwright/test'
import type { GasSettings } from '../type/GasSettings'
import type { Networks } from '../type/Networks'
import { PhantomAbstract } from '../type/PhantomAbstract'
import { HomePage, NotificationPage, OnboardingPage, UnlockPage } from './pages'

const NO_EXTENSION_ID_ERROR = new Error('Phantom extensionId is not set')

/**
 * Phantom class for interacting with the Phantom extension in Playwright tests.
 *
 * This class provides methods to perform various operations on the Phantom extension,
 * such as importing wallets, switching networks, confirming transactions, and more.
 *
 * @class
 * @extends PhantomAbstract
 */
export class Phantom extends PhantomAbstract {
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
  readonly notificationPage: NotificationPage

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
    this.notificationPage = new NotificationPage(page)
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
    await this.homePage.addNewAccount(accountName)
  }

  /**
   * Renames the currently selected account.
   *
   * @param currentAccountName - The current account name.
   * @param newAccountName - The new name for the account.
   */
  async renameAccount(currentAccountName: string, newAccountName: string): Promise<void> {
    await this.homePage.renameAccount(currentAccountName, newAccountName)
  }

  /**
   * Imports a wallet using the given private key.
   *
   * @param network - Network that the wallet belongs to.
   * @param privateKey - The private key to import.
   * @param privateKey - Name given to the new wallet/account.
   */
  async importWalletFromPrivateKey(
    network: 'solana' | 'ethereum' | 'base' | 'polygon' | 'bitcoin',
    privateKey: string,
    walletName?: string
  ): Promise<void> {
    await this.homePage.importWalletFromPrivateKey(network, privateKey, walletName)
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
  async getAccountAddress(network: Networks): Promise<string> {
    return await this.homePage.getAccountAddress(network)
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

    await this.notificationPage.connectToDapp(this.extensionId, account)
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

    await this.notificationPage.signMessage(this.extensionId)
  }

  /**
   * Confirms a signature request with risk.
   *
   * @throws {Error} If extensionId is not set.
   */
  async confirmSignatureWithRisk(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.signMessageWithRisk(this.extensionId)
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

    await this.notificationPage.rejectMessage(this.extensionId)
  }

  /**
   * Confirms a transaction.
   *
   * @param options - Optional gas settings for the transaction.
   * @throws {Error} If extensionId is not set.
   */
  async confirmTransaction(options?: {
    gasSetting?: GasSettings
  }): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.confirmTransaction(this.extensionId, options)
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

    await this.notificationPage.rejectTransaction(this.extensionId)
  }

  /**
   * Approves a token permission request.
   *
   * @param options - Optional settings for the approval.
   * @throws {Error} If extensionId is not set.
   */
  async approveTokenPermission(options?: {
    spendLimit?: 'max' | number
    gasSetting?: GasSettings
  }): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.approveTokenPermission(this.extensionId, options)
  }

  /**
   * Rejects a token permission request.
   *
   * @throws {Error} If extensionId is not set.
   */
  async rejectTokenPermission(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectTokenPermission(this.extensionId)
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
  async toggleTestnetMode(): Promise<void> {
    await this.homePage.toggleTestnetMode()
  }

  /**
   * Resets the account.
   */
  async resetApp(): Promise<void> {
    await this.homePage.resetApp()
  }

  /**
   * Connects Phantom to a dapp.
   *
   * @param accounts - Optional array of account addresses to connect.
   * @throws {Error} If extensionId is not set.
   */
  async closeUnsupportedNetworkWarning(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.closeUnsupportedNetworkWarning(this.extensionId)
  }
}
