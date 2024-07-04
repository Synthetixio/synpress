import type { Page } from '@playwright/test'
import { lockPageElements } from './selectors'

export class LockPage {
  static readonly selectors = lockPageElements
  readonly selectors = lockPageElements

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }
}
