import type { Page } from '@playwright/test'
import { connectToDapp } from './actions'

export class NotificationPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async connectToDapp(extensionId: string) {
    await connectToDapp(this.page.context(), extensionId)
  }
}
