import type { Page } from '@playwright/test'
import Selectors from '../../../selectors/pages/HomePage'
import type { Networks } from '../../../type/Networks'
import {
  addNewAccount,
  getAccountAddress,
  importWalletFromPrivateKey,
  lock,
  renameAccount,
  settings,
  switchAccount,
  toggleTestnetMode
} from './actions'

export class HomePage {
  static readonly selectors = Selectors
  readonly selectors = Selectors

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goToHomePage(extensionId: string) {
    await this.page.goto(`chrome-extension://${extensionId}/popup.html`)
  }

  async goBackToHomePage() {
    await this.page.locator(Selectors.settings.closeSettingsButton).click()
  }

  async lock() {
    await lock(this.page)
  }

  async addNewAccount(accountName: string) {
    await addNewAccount(this.page, accountName)
  }

  async renameAccount(currentAccountName: string, newAccountName: string) {
    await renameAccount(this.page, currentAccountName, newAccountName)
  }

  async getAccountAddress(network: Networks) {
    return await getAccountAddress(network, this.page)
  }

  async importWalletFromPrivateKey(
    network: 'solana' | 'ethereum' | 'base' | 'polygon' | 'bitcoin',
    privateKey: string,
    walletName?: string
  ) {
    await importWalletFromPrivateKey(this.page, network, privateKey, walletName)
  }

  async switchAccount(accountName: string) {
    await switchAccount(this.page, accountName)
  }

  async openSettings() {
    await settings.openSettings(this.page)
  }

  async toggleTestnetMode() {
    await toggleTestnetMode(this.page)
  }

  async resetApp() {
    await settings.resetApp(this.page)
  }
}
