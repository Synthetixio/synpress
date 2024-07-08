import type { Page } from '@playwright/test'
import Selectors from '../../../selectors/pages/SettingsPage'
import { enableEthSign } from './actions'
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
