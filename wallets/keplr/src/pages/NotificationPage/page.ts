import type { Page } from '@playwright/test'
import { acceptAccess, rejectAccess } from './actions'
import { notificationPageElements } from './selectors'

export class NotificationPage {
  static readonly selectors = notificationPageElements
  readonly selectors = notificationPageElements

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async acceptAccess() {
    await acceptAccess(this.page)
  }

  async rejectAccess() {
    await rejectAccess(this.page)
  }
}
