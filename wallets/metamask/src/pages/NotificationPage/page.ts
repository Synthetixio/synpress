import type { Page } from '@playwright/test'
import { connectToDapp, personalSign } from './actions'

export class NotificationPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async connectToDapp(extensionId: string) {
    await connectToDapp(this.page.context(), extensionId)
  }

  async signPersonalMessage(extensionId: string) {
    await personalSign.sign(this.page.context(), extensionId)
  }

  async rejectPersonalMessage(extensionId: string) {
    await personalSign.reject(this.page.context(), extensionId)
  }
}
