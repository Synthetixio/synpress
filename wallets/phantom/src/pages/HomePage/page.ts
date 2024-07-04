import type { Page } from '@playwright/test'
import { homePageElements } from './selectors'

export class HomePage {
  static readonly selectors = homePageElements
  readonly selectors = homePageElements

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }
}
