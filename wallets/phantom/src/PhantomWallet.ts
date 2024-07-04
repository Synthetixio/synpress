import { type BrowserContext, type Page } from '@playwright/test'
import { HomePage } from './pages/HomePage/page'
import { LockPage } from './pages/LockPage/page'
import { NotificationPage } from './pages/NotificationPage/page'
import { SettingsPage } from './pages/SettingsPage/page'
import { ConfirmationPage } from './pages/ConfirmationPage/page'

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
   * @param secretWordsOrPrivateKey. The secret words or private key to import.
   * @param password. The password to set.
   */
  async setupWallet({ secretWordsOrPrivateKey, password }: { secretWordsOrPrivateKey: string; password: string }) {
    console.log(secretWordsOrPrivateKey, password)
  }

  async createWallet(password: string) {
    console.log(password)
  }

  async getWalletAddress(wallet: string) {
    console.log(wallet)
  }

  async addNewTokensFound() {
    console.log('')
  }

  async disconnectWalletFromDapps() {
    console.log('')
  }

  async acceptAccess() {
    console.log('')
  }

  async rejectAccess() {
    console.log('')
  }
}
