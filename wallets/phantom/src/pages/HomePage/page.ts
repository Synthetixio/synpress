import type { Page } from '@playwright/test'
import { changeAccount, closePopupAndTooltips, disconnectFromApp, getWalletAddress, selectDefaultWallet, backToMain } from './actions'
import { homePageElements } from './selectors'

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

  async getWalletAddress(extensionId: string, chainId: string) {
    return await getWalletAddress(this.page, extensionId, chainId)
  }

  async closePopupAndTooltips(extensionId: string) {
    await closePopupAndTooltips(this.page, extensionId)
  }

  async disconnectFromApp(extensionId: string) {
    await disconnectFromApp(this.page, extensionId)
  }

  async selectDefaultWallet(extensionId: string, wallet: string) {
    await selectDefaultWallet(this.page, extensionId, wallet)
  }

  async backToMain() {
    await backToMain(this.page)
  }
}
