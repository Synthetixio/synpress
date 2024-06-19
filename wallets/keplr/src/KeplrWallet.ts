import { type BrowserContext, type Page } from '@playwright/test'
import { LockPage } from './pages/LockPage/page'
import { HomePage } from './pages/HomePage/page'
import { NotificationPage } from './pages/NotificationPage/page'

export class KeplrWallet {
  readonly lockPage: LockPage
  readonly homePage: HomePage
  readonly notificationPage: NotificationPage

  constructor(
    readonly page: Page,
    readonly context?: BrowserContext,
    readonly password?: string,
    readonly extensionId?: string | undefined,
  ) {
    this.lockPage = new LockPage(page)
    this.homePage = new HomePage(page)
    this.notificationPage = new NotificationPage(page)
  }
  /**
   * Does initial setup for the wallet.
   * 
   * @param playwrightInstance. The playwright instance to use.
   * @param secretWordsOrPrivateKey. The secret words or private key to import.
   * @param password. The password to set.
   */
  async setupWallet(
    { secretWordsOrPrivateKey, password }: { secretWordsOrPrivateKey: string; password: string },
  ) {
    const wallet = await this.lockPage.importWallet(secretWordsOrPrivateKey, password)
    return wallet;
  }

  async getWalletAddress(wallet: string) {
    const walletAddress = await this.homePage.getWalletAddress(wallet)
    return walletAddress;
  }
}
