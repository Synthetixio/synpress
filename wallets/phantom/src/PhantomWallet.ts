import { type BrowserContext, type Page } from '@playwright/test'
import { ConfirmationPage } from './pages/ConfirmationPage/page'
import { HomePage } from './pages/HomePage/page'
import { LockPage } from './pages/LockPage/page'
import { NotificationPage } from './pages/NotificationPage/page'
import { SettingsPage } from './pages/SettingsPage/page'

export class PhantomWallet {
  readonly lockPage: LockPage
  readonly homePage: HomePage
  readonly notificationPage: NotificationPage
  readonly settingsPage: SettingsPage
  readonly confirmationPage: ConfirmationPage

  constructor(
    readonly page: Page,
    readonly context?: BrowserContext,
    readonly password?: string,
    readonly extensionId?: string | undefined
  ) {
    this.lockPage = new LockPage(page)
    this.homePage = new HomePage(page)
    this.notificationPage = new NotificationPage(page)
    this.settingsPage = new SettingsPage(page)
    this.confirmationPage = new ConfirmationPage(page)
  }
  /**
   * Does initial setup for the wallet.
   *
   * @param playwrightInstance. The playwright instance to use.
   * @param secretWords. The secret words or private key to import.
   * @param password. The password to set.
   */
  async importWallet({ secretWords, password }: { secretWords: string; password: string }) {
    await this.lockPage.importWallet(secretWords, password)
  }

  async createWallet(password: string) {
    await this.lockPage.createWallet(password)
  }

  async getWalletAddress(wallet: string) {
    await this.homePage.getWalletAddress(this.extensionId!, wallet)
  }

  async changeAccount(accountIndex: number) {
    await this.homePage.changeAccount(accountIndex)
  }

  async closePopupAndTooltips() {
    await this.homePage.closePopupAndTooltips(this.extensionId!)
  }

  async disconnectFromApp() {
    await this.homePage.disconnectFromApp(this.extensionId!)
  }

  async selectWallet(wallet: string) {
    await this.notificationPage.selectWallet(this.extensionId!, wallet)
  }

  async lock() {
    await this.notificationPage.lock(this.extensionId!)
  }

  async acceptAccess() {
    await this.notificationPage.acceptAccess(this.extensionId!)
  }

  async confirmIncorrectNetwork() {
    await this.notificationPage.confirmIncorrectNetwork(this.extensionId!)
  }

  async confirmSignature() {
    await this.notificationPage.confirmSignatureRequest(this.extensionId!)
  }

  async confirmTransaction() {
    await this.notificationPage.confirmTransaction(this.extensionId!)
  }

  async rejectSignature() {
    await this.notificationPage.rejectSignatureRequest(this.extensionId!)
  }

  async rejectTransaction() {
    await this.notificationPage.rejectTransaction(this.extensionId!)
  }
}
