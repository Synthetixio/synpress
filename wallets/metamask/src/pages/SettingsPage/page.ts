import type { Page } from '@playwright/test'
import { enableEthSign } from './actions'
import Selectors from './selectors'
import disableEthSign from './actions/disableEthSign'

export class SettingsPage {
  static readonly selectors = Selectors

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async enableEthSign() {
    await enableEthSign(this.page)
  }

  async disableEthSign() {
    await disableEthSign(this.page)
  }
}
