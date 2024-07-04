import type { Page } from '@playwright/test'
import { confirmationPageElements } from './selectors'

export class ConfirmationPage {
  static readonly selectors = confirmationPageElements
  readonly selectors = confirmationPageElements

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }
}
