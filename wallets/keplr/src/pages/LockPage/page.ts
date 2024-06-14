import type { Page } from '@playwright/test'
import { onboardingElements } from './selectors'
import { importWallet } from './actions'

export class LockPage {
  static readonly selectors = onboardingElements
  readonly selectors = onboardingElements

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async unlock(seedPhrase: string, password: string) {
    await importWallet(this.page, seedPhrase, password)
  }
}
