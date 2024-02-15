import type { BrowserContext, Page } from '@playwright/test'
import { CrashPage, HomePage, LockPage, NotificationPage, OnboardingPage } from './pages'
import type { Network } from './pages/HomePage/actions'
import { SettingsSidebarMenus } from './pages/HomePage/selectors/settings'
import type { GasSetting } from './pages/NotificationPage/actions'

const NO_EXTENSION_ID_ERROR = new Error('MetaMask extensionId is not set')

/**
 * This class is the heart of Synpress's MetaMask API.
 */
export class MetaMask {
  /**
   * This property can be used to access selectors for a given page.
   *
   * @group Selectors
   */
  readonly crashPage: CrashPage
  /**
   * This property can be used to access selectors for a given page.
   *
   * @group Selectors
   */
  readonly onboardingPage: OnboardingPage
  /**
   * This property can be used to access selectors for a given page.
   *
   * @group Selectors
   */
  readonly lockPage: LockPage
  /**
   * This property can be used to access selectors for a given page.
   *
   * @group Selectors
   */
  readonly homePage: HomePage
  /**
   * This property can be used to access selectors for a given page.
   *
   * @group Selectors
   */
  readonly notificationPage: NotificationPage

  /**
   * Class constructor.
   *
   * @param context - The browser context.
   * @param page - The MetaMask tab page.
   * @param password - The password of the MetaMask wallet.
   * @param extensionId - The extension ID of the MetaMask extension. Optional if no interaction with the dapp is required.
   *
   * @returns A new instance of the MetaMask class.
   */
  constructor(
    /**
     * The browser context.
     */
    readonly context: BrowserContext,
    /**
     * The MetaMask tab page.
     */
    readonly page: Page,
    /**
     * The password of the MetaMask wallet.
     */
    readonly password: string,
    /**
     * The extension ID of the MetaMask extension. Optional if no interaction with the dapp is required.
     */
    readonly extensionId?: string
  ) {
    this.crashPage = new CrashPage()

    this.onboardingPage = new OnboardingPage(page)
    this.lockPage = new LockPage(page)
    this.homePage = new HomePage(page)
    this.notificationPage = new NotificationPage(page)
  }

  /**
   * Imports a wallet using the given seed phrase.
   *
   * @param seedPhrase - The seed phrase to import.
   */
  async importWallet(seedPhrase: string) {
    await this.onboardingPage.importWallet(seedPhrase, this.password)
  }

  /**
   * Adds a new account with the given name. This account is based on the initially imported seed phrase.
   *
   * @param accountName - The name of the new account.
   */
  async addNewAccount(accountName: string) {
    await this.homePage.addNewAccount(accountName)
  }

  /**
   * Imports a wallet using the given private key.
   *
   * @param privateKey - The private key to import.
   */
  async importWalletFromPrivateKey(privateKey: string) {
    await this.homePage.importWalletFromPrivateKey(privateKey)
  }

  /**
   * Switches to the account with the given name.
   *
   * @param accountName - The name of the account to switch to.
   */
  async switchAccount(accountName: string) {
    await this.homePage.switchAccount(accountName)
  }

  /**
   * Adds a new network.
   *
   * @param network - The network object to use for adding the new network.
   * @param network.name - The name of the network.
   * @param network.rpcUrl - The RPC URL of the network.
   * @param network.chainId - The chain ID of the network.
   * @param network.symbol - The currency symbol of the network.
   * @param network.blockExplorerUrl - The block explorer URL of the network.
   */
  async addNetwork(network: Network) {
    await this.homePage.addNetwork(network)
  }

  /**
   * Switches to the network with the given name.
   *
   * @param networkName - The name of the network to switch to.
   * @param isTestnet - If switch to a test network.
   */
  async switchNetwork(networkName: string, isTestnet = false) {
    await this.homePage.switchNetwork(networkName, isTestnet)
  }

  /**
   * Connects to the dapp using the currently selected account.
   */
  async connectToDapp(accounts?: string[]) {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.connectToDapp(this.extensionId, accounts)
  }

  /**
   * Locks MetaMask.
   */
  async lock() {
    await this.homePage.lock()
  }

  /**
   * Unlocks MetaMask.
   */
  async unlock() {
    await this.lockPage.unlock(this.password)
  }

  /**
   * Confirms a signature request. This function supports all types of commonly used signatures.
   */
  async confirmSignature() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.signMessage(this.extensionId)
  }

  /**
   * Rejects a signature request. This function supports all types of commonly used signatures.
   */
  async rejectSignature() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectMessage(this.extensionId)
  }

  /**
   * Approves a new network request.
   */
  async approveNewNetwork() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.approveNewNetwork(this.extensionId)
  }

  /**
   * Rejects a new network request.
   */
  async rejectNewNetwork() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectNewNetwork(this.extensionId)
  }

  /**
   * Approves a switch network request.
   */
  async approveSwitchNetwork() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.approveSwitchNetwork(this.extensionId)
  }

  /**
   * Rejects a switch network request.
   */
  async rejectSwitchNetwork() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectSwitchNetwork(this.extensionId)
  }

  /**
   * Confirms a transaction request.
   *
   * @param options - The transaction options.
   * @param options.gasSetting - The gas setting to use for the transaction.
   */
  async confirmTransaction(options?: { gasSetting?: GasSetting }) {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.confirmTransaction(this.extensionId, options)
  }

  /**
   * Rejects a transaction request.
   */
  async rejectTransaction() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectTransaction(this.extensionId)
  }

  /**
   * Approves a permission request to spend tokens.
   *
   * ::: warning
   * For NFT approvals, use `confirmTransaction` method.
   * :::
   *
   * @param options - The permission options.
   * @param options.spendLimit - The spend limit to use for the permission.
   * @param options.gasSetting - The gas setting to use for the approval transaction.
   */
  async approveTokenPermission(options?: {
    spendLimit?: 'max' | number
    gasSetting?: GasSetting
  }) {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.approveTokenPermission(this.extensionId, options)
  }

  /**
   * Rejects a permission request to spend tokens.
   *
   * ::: warning
   * For NFT approvals, use `confirmTransaction` method.
   * :::
   */
  async rejectTokenPermission() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectTokenPermission(this.extensionId)
  }

  /**
   * Goes back to the home page of MetaMask tab.
   */
  async goBackToHomePage() {
    await this.homePage.goBackToHomePage()
  }

  /**
   * Opens the settings page.
   */
  async openSettings() {
    await this.homePage.openSettings()
  }

  /**
   * Opens a given menu in the sidebar.
   *
   * @param menu - The menu to open.
   */
  async openSidebarMenu(menu: SettingsSidebarMenus) {
    await this.homePage.openSidebarMenu(menu)
  }

  /**
   * Toggles the "Show Test Networks" setting.
   *
   * ::: warning
   * This function requires the correct menu to be already opened.
   * :::
   */
  async toggleShowTestNetworks() {
    await this.homePage.toggleShowTestNetworks()
  }

  /**
   * Toggles the "Dismiss Secret Recovery Phrase Reminder" setting.
   *
   * ::: warning
   * This function requires the correct menu to be already opened.
   * :::
   */
  async toggleDismissSecretRecoveryPhraseReminder() {
    await this.homePage.toggleDismissSecretRecoveryPhraseReminder()
  }

  /**
   * Resets the account.
   *
   * ::: warning
   * This function requires the correct menu to be already opened.
   * :::
   */
  async resetAccount() {
    await this.homePage.resetAccount()
  }

  /// -------------------------------------------
  /// ---------- EXPERIMENTAL FEATURES ----------
  /// -------------------------------------------

  /**
   * Confirms a transaction request and waits for the transaction to be mined.
   * This function utilizes the "Activity" tab of the MetaMask tab.
   *
   * @param options - The transaction options.
   * @param options.gasSetting - The gas setting to use for the transaction.
   *
   * @experimental
   * @group Experimental Methods
   */
  async confirmTransactionAndWaitForMining(options?: {
    gasSetting?: GasSetting
  }) {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.confirmTransactionAndWaitForMining(this.extensionId, options)
  }

  /**
   * Opens the transaction details.
   *
   * @param txIndex - The index of the transaction in the "Activity" tab. Starts from `0`.
   *
   * @experimental
   * @group Experimental Methods
   */
  async openTransactionDetails(txIndex: number) {
    await this.homePage.openTransactionDetails(txIndex)
  }

  /**
   * Closes the currently opened transaction details.
   *
   * @experimental
   * @group Experimental Methods
   */
  async closeTransactionDetails() {
    await this.homePage.closeTransactionDetails()
  }
}
