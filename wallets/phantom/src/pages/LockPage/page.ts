import type { Page } from '@playwright/test'
import { lockPageElements } from './selectors'
import { importWallet } from './actions'

export class LockPage {
  static readonly selectors = lockPageElements
  readonly selectors = lockPageElements

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async importWallet(secretWords: string, password: string) {
    await importWallet(this.page, secretWords, password)
  }
}
