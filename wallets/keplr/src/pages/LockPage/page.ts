import type { Page } from '@playwright/test'
import { importWallet } from './actions'
import { unlockWallet } from './actions'
import { createWallet } from './actions'
import { onboardingElements } from './selectors'

export class LockPage {
  static readonly selectors = onboardingElements
  readonly selectors = onboardingElements

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async unlock(password: string) {
    await unlockWallet(this.page, password)
  }

  async importWallet(secretWordsOrPrivateKey: string, password: string) {
    await importWallet(this.page, secretWordsOrPrivateKey, password)
  }

  async createWallet(password: string) {
    await createWallet(this.page, password)
  }
}
