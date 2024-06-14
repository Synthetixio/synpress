import type { Page } from '@playwright/test'
import { homePageElements } from './selectors'
import { getTokenAmount, getWalletAddress, addNewTokensFound } from './actions'

export class HomePage {
  static readonly selectors = homePageElements
  readonly selectors = homePageElements

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async getTokenAmount() {
    return await getTokenAmount(this.page, 'token name')
  }
  
  async getWalletAddress() {
    return await getWalletAddress(this.page)
  }

  async addNewTokensFound() {
    return await addNewTokensFound(this.page)
  }
}
