import type { Page } from '@playwright/test'
import { onboardingElements } from './selectors'
import { importWallet } from './actions'
import { SEED_PHRASE } from '../../utils'

export class LockPage {
  static readonly selectors = onboardingElements
  readonly selectors = onboardingElements

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async unlock(password: string) {
    await importWallet(SEED_PHRASE, password)
  }
}
