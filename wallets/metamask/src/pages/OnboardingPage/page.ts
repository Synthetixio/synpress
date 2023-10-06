import type { Page } from '@playwright/test'
import { importWallet } from './actions'

export class OnboardingPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async importWallet(seedPhrase: string, password: string) {
    return importWallet(this.page, seedPhrase, password)
  }
}
