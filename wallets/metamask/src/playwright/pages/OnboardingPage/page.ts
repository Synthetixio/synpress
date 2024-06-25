import type { Page } from '@playwright/test'
import { importWallet } from './actions'
import Selectors from './selectors'

export class OnboardingPage {
  static readonly selectors = Selectors
  readonly selectors = Selectors

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async importWallet(seedPhrase: string, password: string) {
    return await importWallet(this.page, seedPhrase, password)
  }
}
