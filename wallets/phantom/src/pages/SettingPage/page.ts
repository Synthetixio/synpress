import type { Page } from '@playwright/test'
import { settingsPageElements } from './selectors'

export class LockPage {
  static readonly selectors = settingsPageElements
  readonly selectors = settingsPageElements

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }
}
