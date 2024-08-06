import type { Page } from '@playwright/test'
import Selectors from '../../../selectors/pages/HomePage'
import type { SettingsSidebarMenus } from '../../../selectors/pages/HomePage/settings'
import type { Network } from '../../../type/Network'
import {
  addNetwork,
  addNewAccount,
  getAccountAddress,
  importWalletFromPrivateKey,
  lock,
  renameAccount,
  settings,
  switchAccount,
  switchNetwork,
  toggleShowTestNetworks,
  transactionDetails
} from './actions'

export class HomePage {
  static readonly selectors = Selectors
  readonly selectors = Selectors

  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goBackToHomePage() {
    await this.page.locator(Selectors.logo).click()
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

  async getAccountAddress() {
    return await getAccountAddress(this.page)
  }

  async importWalletFromPrivateKey(privateKey: string) {
    await importWalletFromPrivateKey(this.page, privateKey)
  }

  async switchAccount(accountName: string) {
    await switchAccount(this.page, accountName)
  }

  async openSettings() {
    await settings.openSettings(this.page)
  }

  async openSidebarMenu(menu: SettingsSidebarMenus) {
    await settings.openSidebarMenu(this.page, menu)
  }

  async toggleShowTestNetworks() {
    await toggleShowTestNetworks(this.page)
  }

  async resetAccount() {
    await settings.advanced.resetAccount(this.page)
  }

  async toggleDismissSecretRecoveryPhraseReminder() {
    await settings.advanced.toggleDismissSecretRecoveryPhraseReminder(this.page)
  }

  async switchNetwork(networkName: string, isTestnet: boolean) {
    await switchNetwork(this.page, networkName, isTestnet)
  }

  async addNetwork(network: Network) {
    await addNetwork(this.page, network)
  }

  async openTransactionDetails(txIndex: number) {
    await transactionDetails.open(this.page, txIndex)
  }

  async closeTransactionDetails() {
    await transactionDetails.close(this.page)
  }
}
