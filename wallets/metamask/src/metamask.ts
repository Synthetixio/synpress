import type { BrowserContext, Page } from '@playwright/test'
import { CrashPage, HomePage, LockPage, NotificationPage, OnboardingPage } from './pages'

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

  async approvePermission(customSpendLimit?: number) {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.approvePermission(this.extensionId, customSpendLimit)
  }

  async rejectPermission() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }

    await this.notificationPage.rejectPermission(this.extensionId)
  }
}
