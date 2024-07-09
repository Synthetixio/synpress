import type { Page } from '@playwright/test'
import { homePageElements } from './selectors'
import { changeAccount, getWalletAddress, closePopupAndTooltips, disconnectFromApp } from './actions'

export class HomePage {
  static readonly selectors = homePageElements
  readonly selectors = homePageElements

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async changeAccount(accountIndex?: number) {
    return await changeAccount(this.page, accountIndex)
  }

  async getWalletAddress(extensionId: string, chainId: string){
    return await getWalletAddress(this.page, extensionId, chainId)
  }

  async closePopupAndTooltips(extensionId: string) {
    await closePopupAndTooltips(this.page, extensionId)
  }

  async disconnectFromApp(extensionId: string) {
    await disconnectFromApp(this.page, extensionId)
  }
}
