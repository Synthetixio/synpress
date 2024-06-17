import { type BrowserContext, type Page } from '@playwright/test'
import { LockPage } from './pages/LockPage/page'
import { HomePage } from './pages/HomePage/page'

export class KeplrWallet {
  seedPhrase = ''
  retries: number
  browser: any
  mainWindow: any
  keplrWindow: any
  keplrNotification: any
  activeTabName: string | undefined
  extensionData: any
  extensionVersion: string | undefined

  constructor(
    readonly page: Page,
    readonly context: BrowserContext,
    readonly password: string,
    readonly extensionId: string | undefined,
  ) {
    this.page = page
    this.browser = undefined
    this.mainWindow = undefined
    this.keplrWindow = undefined
    this.keplrNotification = undefined
    this.activeTabName = undefined
    this.extensionData = undefined
    this.retries = 0
    this.extensionId = undefined
    this.extensionVersion = undefined
  }
  /**
   * Does initial setup for the wallet.
   * 
   * @param playwrightInstance. The playwright instance to use.
   * @param secretWordsOrPrivateKey. The secret words or private key to import.
   * @param password. The password to set.
   */
  async setupWallet(
    page: Page,
    { secretWordsOrPrivateKey, password }: { secretWordsOrPrivateKey: string; password: string },
  ) {
    const lockpage = new LockPage(page)
    const wallet = await lockpage.unlock(secretWordsOrPrivateKey, password)
    return wallet;
  }

  async getWalletAddress(
    page: Page,
  ) {
    const homePage = new HomePage(page)
    console.log('homePage', homePage, 1)
    const walletAddress = await homePage.getWalletAddress()
    return walletAddress;
  }
}
