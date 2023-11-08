import type { BrowserContext, Page } from '@playwright/test'
import { CrashPage, HomePage, LockPage, NotificationPage, OnboardingPage } from './pages'

export class MetaMask {
  crashPage: CrashPage
  onboardingPage: OnboardingPage
  lockPage: LockPage
  homePage: HomePage
  notificationPage: NotificationPage

  constructor(readonly context: BrowserContext, readonly page: Page, readonly password: string) {
    this.crashPage = new CrashPage()

    this.onboardingPage = new OnboardingPage(page)
    this.lockPage = new LockPage(page)
    this.homePage = new HomePage(page)
    this.notificationPage = new NotificationPage(page)
  }

  async importWallet(seedPhrase: string) {
    await this.onboardingPage.importWallet(seedPhrase, this.password)
  }

  async connectToDapp(extensionId: string) {
    await this.notificationPage.connectToDapp(extensionId)
  }

  async lock() {
    await this.homePage.lock()
  }

  async unlock() {
    await this.lockPage.unlock(this.password)
  }
}
