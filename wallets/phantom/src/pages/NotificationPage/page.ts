import type { Page } from '@playwright/test'
import { notificationPageElements } from './selectors'
import { acceptAccess, confirmIncorrectNetwork, confirmSignatureRequest, confirmTransaction, rejectSignatureRequest, rejectTransaction, lock, selectWallet } from './actions'

export class NotificationPage {
  static readonly selectors = notificationPageElements
  readonly selectors = notificationPageElements

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async lock(extensionId: string) {
    await lock(this.page, extensionId)
  }

  async acceptAccess(extensionId: string) {
    await acceptAccess(this.page, extensionId)
  }

  async selectWallet(extensionId: string, wallet: string) {
    await selectWallet(this.page, extensionId, wallet)
  }

  async confirmIncorrectNetwork(extensionId: string) {
    await confirmIncorrectNetwork(this.page, extensionId)
  }

  async confirmSignatureRequest(extensionId: string) {
    await confirmSignatureRequest(this.page, extensionId)
  }

  async confirmTransaction(extensionId: string) {
    await confirmTransaction(this.page, extensionId)
  }

  async rejectTransaction(extensionId: string) {
    await rejectTransaction(this.page, extensionId)
  }

  async rejectSignatureRequest(extensionId: string) {
    await rejectSignatureRequest(this.page, extensionId)
  }
}
