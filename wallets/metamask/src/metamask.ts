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
    await this.notificationPage.signPersonalMessage(this.extensionId)
  }

  async rejectSignature() {
    if (!this.extensionId) {
      throw NO_EXTENSION_ID_ERROR
    }
    await this.notificationPage.rejectPersonalMessage(this.extensionId)
  }
}
