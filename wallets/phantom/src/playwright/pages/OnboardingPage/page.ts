import type { Page } from '@playwright/test'
import Selectors from '../../../selectors/pages/OnboardingPage'
import { importWallet } from './actions'

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
