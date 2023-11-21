import type { BrowserContext, Page } from '@playwright/test'
import { CrashPage, HomePage, LockPage, NotificationPage, OnboardingPage } from './pages'
import type { Network } from './pages/HomePage/actions'
import { SettingsSidebarMenus } from './pages/HomePage/selectors/settings'

const NO_EXTENSION_ID_ERROR = new Error('MetaMask extensionId is not set')

export class MetaMask {
  crashPage: CrashPage
  onboardingPage: OnboardingPage
  lockPage: LockPage
  homePage: HomePage
  notificationPage: NotificationPage

  constructor(
    readonly context: BrowserContext,
    readonly page: Page,
    readonly password: string,
    readonly extensionId?: string
  ) {
    this.crashPage = new CrashPage()

    this.onboardingPage = new OnboardingPage(page)
    this.lockPage = new LockPage(page)
    this.homePage = new HomePage(page)
    this.notificationPage = new NotificationPage(page)
  }

  async importWallet(seedPhrase: string) {
    await this.onboardingPage.importWallet(seedPhrase, this.password)
  }

  async importWalletFromPrivateKey(privateKey: string) {
    await this.homePage.importWalletFromPrivateKey(privateKey)
  }

  async switchAccount(accountName: string) {
    await this.homePage.switchAccount(accountName)
  }

  async addNetwork(network: Network) {
    await this.homePage.addNetwork(network)
  }

  async switchNetwork(networkName: string) {
    await this.homePage.switchNetwork(networkName)
  }

  async connectToDapp() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.connectToDapp(this.extensionId)
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

  async confirmTransaction() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.confirmTransaction(this.extensionId)
  }

  async rejectTransaction() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectTransaction(this.extensionId)
  }

  async approvePermission(spendLimit?: 'default' | 'max' | number) {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.approvePermission(this.extensionId, spendLimit)
  }

  async rejectPermission() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectPermission(this.extensionId)
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

  async toggleImprovedTokenAllowanceExperience() {
    await this.homePage.toggleImprovedTokenAllowanceExperience()
  }

  // ---- EXPERIMENTAL FEATURES ----

  public readonly experimental = {
    confirmTransactionAndWaitForMining: async () => await this.confirmTransactionAndWaitForMining()
  }

  private async confirmTransactionAndWaitForMining() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.confirmTransactionAndWaitForMining(this.extensionId)
  }
}
