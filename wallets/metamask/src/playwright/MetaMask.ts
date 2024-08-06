import type { BrowserContext, Page } from '@playwright/test'
import { SettingsSidebarMenus } from '../selectors/pages/HomePage/settings'
import { MetaMaskAbstract } from '../type/MetaMaskAbstract'
import type { Network } from '../type/Network'
import { CrashPage, HomePage, LockPage, NotificationPage, OnboardingPage } from './pages'
import type { GasSetting } from './pages/NotificationPage/actions'
import { SettingsPage } from './pages/SettingsPage/page'

const NO_EXTENSION_ID_ERROR = new Error('MetaMask extensionId is not set')

export class MetaMask extends MetaMaskAbstract {
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
  readonly settingsPage: SettingsPage

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
    override readonly password: string,
    /**
     * The extension ID of the MetaMask extension. Optional if no interaction with the dapp is required.
     */
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

  async importWallet(seedPhrase: string) {
    await this.onboardingPage.importWallet(seedPhrase, this.password)
  }

  async addNewAccount(accountName: string) {
    await this.homePage.addNewAccount(accountName)
  }

  /**
   * Renames the currently selected account.
   *
   * @param currentAccountName - The current account name.
   * @param newAccountName - The new name for the account.
   */
  async renameAccount(currentAccountName: string, newAccountName: string) {
    await this.homePage.renameAccount(currentAccountName, newAccountName)
  }

  /**
   * Imports a wallet using the given private key.
   *
   * @param privateKey - The private key to import.
   */

  async importWalletFromPrivateKey(privateKey: string) {
    await this.homePage.importWalletFromPrivateKey(privateKey)
  }

  async switchAccount(accountName: string) {
    await this.homePage.switchAccount(accountName)
  }

  async addNetwork(network: Network) {
    await this.homePage.addNetwork(network)
  }

  async getAccountAddress() {
    return await this.homePage.getAccountAddress()
  }

  async switchNetwork(networkName: string, isTestnet = false) {
    await this.homePage.switchNetwork(networkName, isTestnet)
  }

  async connectToDapp(accounts?: string[]) {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.connectToDapp(this.extensionId, accounts)
  }

  async lock() {
    await this.homePage.lock()
  }

  async unlock() {
    await this.lockPage.unlock(this.password)
  }

  async confirmSignature() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.signMessage(this.extensionId)
  }

  async confirmSignatureWithRisk() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.signMessageWithRisk(this.extensionId)
  }

  async rejectSignature() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectMessage(this.extensionId)
  }

  async approveNewNetwork() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.approveNewNetwork(this.extensionId)
  }

  async rejectNewNetwork() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectNewNetwork(this.extensionId)
  }

  async approveSwitchNetwork() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.approveSwitchNetwork(this.extensionId)
  }

  async rejectSwitchNetwork() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectSwitchNetwork(this.extensionId)
  }

  async confirmTransaction(options?: { gasSetting?: GasSetting }) {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.confirmTransaction(this.extensionId, options)
  }

  async rejectTransaction() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectTransaction(this.extensionId)
  }

  async approveTokenPermission(options?: {
    spendLimit?: 'max' | number
    gasSetting?: GasSetting
  }) {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.approveTokenPermission(this.extensionId, options)
  }

  async rejectTokenPermission() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectTokenPermission(this.extensionId)
  }

  async goBackToHomePage() {
    await this.homePage.goBackToHomePage()
  }

  async openSettings() {
    await this.homePage.openSettings()
  }

  async openSidebarMenu(menu: SettingsSidebarMenus) {
    await this.homePage.openSidebarMenu(menu)
  }

  async toggleShowTestNetworks() {
    await this.homePage.toggleShowTestNetworks()
  }

  async toggleDismissSecretRecoveryPhraseReminder() {
    await this.homePage.toggleDismissSecretRecoveryPhraseReminder()
  }

  async resetAccount() {
    await this.homePage.resetAccount()
  }

  async unsafe_enableEthSign() {
    await this.homePage.openSettings()
    await this.settingsPage.enableEthSign()
  }

  async disableEthSign() {
    await this.homePage.openSettings()
    await this.settingsPage.disableEthSign()
  }

  async addNewToken() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.addNewToken(this.extensionId)
  }

  async providePublicEncryptionKey() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.providePublicEncryptionKey(this.extensionId)
  }

  async decrypt() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.decryptMessage(this.extensionId)
  }

  async confirmTransactionAndWaitForMining(options?: {
    gasSetting?: GasSetting
  }) {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.confirmTransactionAndWaitForMining(this.extensionId, options)
  }

  async openTransactionDetails(txIndex: number) {
    await this.homePage.openTransactionDetails(txIndex)
  }

  async closeTransactionDetails() {
    await this.homePage.closeTransactionDetails()
  }
}
