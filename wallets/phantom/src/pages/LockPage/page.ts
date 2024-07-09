import type { Page } from '@playwright/test'
import { createAccount, importWallet, unlock } from './actions'
import { lockPageElements } from './selectors'

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

  //@todo: get this written
  async createWallet(password: string) {
    await createAccount(this.page, password)
  }

  async unlock(extensionId: string, password: string) {
    await unlock(this.page, extensionId, password, true)
  }
}
