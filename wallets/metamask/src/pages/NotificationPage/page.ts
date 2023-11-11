import type { Page } from '@playwright/test'
import { connectToDapp, signSimpleMessage } from './actions'

export class NotificationPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async connectToDapp(extensionId: string) {
    await connectToDapp(this.page.context(), extensionId)
  }

  async signSimpleMessage(extensionId: string) {
    await signSimpleMessage.sign(this.page.context(), extensionId)
  }

  async rejectSimpleMessage(extensionId: string) {
    await signSimpleMessage.reject(this.page.context(), extensionId)
  }
}
