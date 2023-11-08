import type { Page } from '@playwright/test'
import { lock } from './actions'
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
}
