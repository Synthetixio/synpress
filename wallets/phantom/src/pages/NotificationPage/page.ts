import type { Page } from '@playwright/test'
import { notificationPageElements } from './selectors'

export class LockPage {
  static readonly selectors = notificationPageElements
  readonly selectors = notificationPageElements

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }
}
