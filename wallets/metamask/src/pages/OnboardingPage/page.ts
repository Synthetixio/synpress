import type { Page } from '@playwright/test'
import { importWallet } from './actions'
import * as Selectors from './selectors'

export class OnboardingPage {
  readonly page: Page
  readonly selectors = Selectors

  constructor(page: Page) {
    this.page = page
  }

  async importWallet(seedPhrase: string, password: string) {
    return await importWallet(this.page, seedPhrase, password)
  }
}
