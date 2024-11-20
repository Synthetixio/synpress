import type { BrowserContext, Page } from '@playwright/test'
import { SettingsSidebarMenus } from '../selectors/pages/HomePage/settings'
import type { GasSettings } from '../type/GasSettings'
import { MetaMaskAbstract } from '../type/MetaMaskAbstract'
import type { Network } from '../type/Network'
import { CrashPage, HomePage, LockPage, NotificationPage, OnboardingPage } from './pages'
import { SettingsPage } from './pages/SettingsPage/page'

const NO_EXTENSION_ID_ERROR = new Error('MetaMask extensionId is not set')

/**
 * MetaMask class for interacting with the MetaMask extension in Playwright tests.
 *
 * This class provides methods to perform various operations on the MetaMask extension,
 * such as importing wallets, switching networks, confirming transactions, and more.
 *
 * @class
 * @extends MetaMaskAbstract
 */
export class MetaMask extends MetaMaskAbstract {
  /**
   * This property can be used to access selectors for the crash page.
   *
   * @public
   * @readonly
   */
  readonly crashPage: CrashPage

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
  readonly lockPage: LockPage

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
   * This property can be used to access selectors for the settings page.
   *
   * @public
   * @readonly
   */
  readonly settingsPage: SettingsPage

  /**
   * Creates an instance of MetaMask.
   *
   * @param context - The Playwright BrowserContext in which the MetaMask extension is running.
   * @param page - The Playwright Page object representing the MetaMask extension's main page.
   * @param password - The password for the MetaMask wallet.
   * @param extensionId - The ID of the MetaMask extension. Optional if no interaction with dapps is required.
   */
  constructor(
    readonly context: BrowserContext,
    readonly page: Page,
    override readonly password: string,
    override readonly extensionId?: string
  ) {
    super(password, extensionId)

    this.crashPage = new CrashPage()
    this.onboardingPage = new OnboardingPage(page)
    this.lockPage = new LockPage(page)
    this.homePage = new HomePage(page)
    this.notificationPage = new NotificationPage(page)
    this.settingsPage = new SettingsPage(page)
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
   * @param privateKey - The private key to import.
   */
  async importWalletFromPrivateKey(privateKey: string): Promise<void> {
    await this.homePage.importWalletFromPrivateKey(privateKey)
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
   * Adds a new network to MetaMask.
   *
   * @param network - The network configuration to add.
   */
  async addNetwork(network: Network): Promise<void> {
    await this.homePage.addNetwork(network)
  }

  /**
   * Gets the address of the currently selected account.
   *
   * @returns The account address.
   */
  async getAccountAddress(): Promise<string> {
    return await this.homePage.getAccountAddress()
  }

  /**
   * Switches to the specified network.
   *
   * @param networkName - The name of the network to switch to.
   * @param isTestnet - Whether the network is a testnet. Default is false.
   */
  async switchNetwork(networkName: string, isTestnet = false): Promise<void> {
    await this.homePage.switchNetwork(networkName, isTestnet)
  }

  /**
   * Connects MetaMask to a dapp.
   *
   * @param accounts - Optional array of account addresses to connect.
   * @throws {Error} If extensionId is not set.
   */
  async connectToDapp(accounts?: string[]): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.connectToDapp(this.extensionId, accounts)
  }

  /**
   * Locks the MetaMask wallet.
   */
  async lock(): Promise<void> {
    await this.homePage.lock()
  }

  /**
   * Unlocks the MetaMask wallet.
   */
  async unlock(): Promise<void> {
    await this.lockPage.unlock(this.password)
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
   * Approves adding a new network.
   *
   * @throws {Error} If extensionId is not set.
   */
  async approveNewNetwork(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.approveNewNetwork(this.extensionId)
  }

  /**
   * Rejects adding a new network.
   *
   * @throws {Error} If extensionId is not set.
   */
  async rejectNewNetwork(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectNewNetwork(this.extensionId)
  }

  /**
   * Approves switching to a new network.
   *
   * @throws {Error} If extensionId is not set.
   */
  async approveSwitchNetwork(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.approveSwitchNetwork(this.extensionId)
  }

  /**
   * Rejects switching to a new network.
   *
   * @throws {Error} If extensionId is not set.
   */
  async rejectSwitchNetwork(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectSwitchNetwork(this.extensionId)
  }

  /**
   * Approves adding a new RPC provider for Ethereum Mainnet.
   *
   * @throws {Error} If extensionId is not set.
   */
  async approveNewEthereumRPC(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.approveNewEthereumRPC(this.extensionId)
  }

  /**
   * Rejects adding a new RPC provider for Ethereum Mainnet.
   *
   * @throws {Error} If extensionId is not set.
   */
  async rejectNewEthereumRPC(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectNewEthereumRPC(this.extensionId)
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
   * Opens a specific sidebar menu in the settings.
   *
   * @param menu - The menu to open.
   */
  async openSidebarMenu(menu: SettingsSidebarMenus): Promise<void> {
    await this.homePage.openSidebarMenu(menu)
  }

  /**
   * Toggles the display of test networks.
   */
  async toggleShowTestNetworks(): Promise<void> {
    await this.homePage.toggleShowTestNetworks()
  }

  /**
   * Toggles the dismissal of the secret recovery phrase reminder.
   */
  async toggleDismissSecretRecoveryPhraseReminder(): Promise<void> {
    await this.homePage.toggleDismissSecretRecoveryPhraseReminder()
  }

  /**
   * Resets the account.
   */
  async resetAccount(): Promise<void> {
    await this.homePage.resetAccount()
  }

  /**
   * Enables eth_sign (unsafe).
   */
  async unsafe_enableEthSign(): Promise<void> {
    await this.homePage.openSettings()
    await this.settingsPage.enableEthSign()
  }

  /**
   * Disables eth_sign.
   */
  async disableEthSign(): Promise<void> {
    await this.homePage.openSettings()
    await this.settingsPage.disableEthSign()
  }

  /**
   * Adds a new token.
   *
   * @throws {Error} If extensionId is not set.
   */
  async addNewToken(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.addNewToken(this.extensionId)
  }

  /**
   * Provides a public encryption key.
   *
   * @throws {Error} If extensionId is not set.
   */
  async providePublicEncryptionKey(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.providePublicEncryptionKey(this.extensionId)
  }

  /**
   * Decrypts a message.
   *
   * @throws {Error} If extensionId is not set.
   */
  async decrypt(): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.decryptMessage(this.extensionId)
  }

  /**
   * Confirms a transaction and waits for it to be mined.
   *
   * @param options - Optional gas settings for the transaction.
   * @throws {Error} If extensionId is not set.
   */
  async confirmTransactionAndWaitForMining(options?: {
    gasSetting?: GasSettings
  }): Promise<void> {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.confirmTransactionAndWaitForMining(this.extensionId, options)
  }

  /**
   * Opens the details of a specific transaction.
   *
   * @param txIndex - The index of the transaction to open.
   */
  async openTransactionDetails(txIndex: number): Promise<void> {
    await this.homePage.openTransactionDetails(txIndex)
  }

  /**
   * Closes the transaction details view.
   */
  async closeTransactionDetails(): Promise<void> {
    await this.homePage.closeTransactionDetails()
  }
}
