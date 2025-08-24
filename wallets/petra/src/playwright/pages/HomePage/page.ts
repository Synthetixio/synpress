import type { Page } from '@playwright/test'
import Selectors from '../../../selectors/pages/HomePage'
import {
  addNewAccount,
  getAccountAddress,
  importWalletFromPrivateKey,
  lock,
  renameAccount,
  settings,
  switchAccount,
  toggleNetworkMode
} from './actions'
import type { NetworkMode } from '../../../type/Networks'
import { importWalletFromMnemonicPhrase } from './actions/importWalletFromMnemonic'

export class HomePage {
  static readonly selectors = Selectors
  readonly selectors = Selectors

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goToHomePage(extensionId: string) {
    await this.page.goto(`chrome-extension://${extensionId}/index.html`)
  }

  async goBackToHomePage() {
    await this.page.locator(Selectors.headerBackButton).click()
  }

  async lock() {
    await lock(this.page)
  }

  async addNewAccount() {
    await addNewAccount(this.page)
  }

  async renameAccount(newAccountName: string) {
    await renameAccount(this.page, newAccountName)
  }

  async getAccountAddress() {
    return await getAccountAddress(this.page)
  }

  async importWalletFromPrivateKey(privateKey: string) {
    await importWalletFromPrivateKey(this.page, privateKey)
  }

  async importWalletFromMnemonicPhrase(seedPhrase: string) {
    await importWalletFromMnemonicPhrase(this.page, seedPhrase)
  }

  async switchAccount(accountName: string) {
    await switchAccount(this.page, accountName)
  }

  async openSettings() {
    await settings.openSettings(this.page)
  }

  async toggleNetworkMode(networkMode: NetworkMode) {
    await toggleNetworkMode(this.page, networkMode)
  }
}
