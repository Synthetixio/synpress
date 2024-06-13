import type { Page } from '@playwright/test'
import { notificationPageElements } from './selectors'
import { confirmTransaction, acceptAccess } from './actions'

export class NotificationPage {
  static readonly selectors = notificationPageElements
  readonly selectors = notificationPageElements

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async confirmTransaction() {
    await confirmTransaction()
  }

  async acceptAccess() {
    await acceptAccess()
  }
}
