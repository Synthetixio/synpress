import type { Page } from '@playwright/test'
import { importWalletFromPrivateKey, lock, switchAccount } from './actions'
import Selectors from './selectors'

export class HomePage {
  static readonly selectors = Selectors
  readonly selectors = Selectors

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async lock() {
    await lock(this.page)
  }

  async importWalletFromPrivateKey(privateKey: string) {
    await importWalletFromPrivateKey(this.page, privateKey)
  }

  async switchAccount(accountName: string) {
    await switchAccount(this.page, accountName)
  }
}
