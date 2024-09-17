import { type BrowserContext, type Page, expect } from '@playwright/test'
import { type CreateAnvilOptions, type Pool, createPool } from '@viem/anvil'
import { MetaMask as MetaMaskPlaywright } from '../playwright/MetaMask'
import { waitFor } from '../playwright/utils/waitFor'
import HomePageSelectors from '../selectors/pages/HomePage'
import Selectors from '../selectors/pages/HomePage'
import TransactionPage from '../selectors/pages/NotificationPage/transactionPage'
import type { GasSettings } from '../type/GasSettings'
import type { Network } from '../type/Network'
import getPlaywrightMetamask from './getPlaywrightMetamask'

let pool: Pool

export default class MetaMask {
  readonly metamaskPlaywright: MetaMaskPlaywright
  readonly metamaskExtensionPage: Page

  constructor(context: BrowserContext, metamaskExtensionPage: Page, metamaskExtensionId: string) {
    this.metamaskPlaywright = getPlaywrightMetamask(context, metamaskExtensionPage, metamaskExtensionId)
    this.metamaskExtensionPage = metamaskExtensionPage
  }

  async getAccount() {
    return await this.metamaskExtensionPage
      .locator(this.metamaskPlaywright.homePage.selectors.accountMenu.accountButton)
      .innerText()
  }

  async getAccountAddress() {
    return await this.metamaskPlaywright.getAccountAddress()
  }

  async getNetwork() {
    return await this.metamaskExtensionPage
      .locator(this.metamaskPlaywright.homePage.selectors.currentNetwork)
      .innerText()
  }

  async connectToDapp(accounts?: string[]) {
    await this.metamaskPlaywright.connectToDapp(accounts)

    return true
  }

  async importWallet(seedPhrase: string) {
    await this.metamaskPlaywright.importWallet(seedPhrase)

    return true
  }

  async importWalletFromPrivateKey(privateKey: string) {
    await this.metamaskPlaywright.importWalletFromPrivateKey(privateKey)

    return true
  }

  async addNewAccount(accountName: string) {
    await this.metamaskPlaywright.addNewAccount(accountName)

    await expect(
      this.metamaskExtensionPage.locator(this.metamaskPlaywright.homePage.selectors.accountMenu.accountButton)
    ).toHaveText(accountName)

    return true
  }

  async switchAccount(accountName: string) {
    await this.metamaskPlaywright.switchAccount(accountName)

    await expect(
      this.metamaskExtensionPage.locator(this.metamaskPlaywright.homePage.selectors.accountMenu.accountButton)
    ).toHaveText(accountName)

    return true
  }

  async renameAccount({
    currentAccountName,
    newAccountName
  }: {
    currentAccountName: string
    newAccountName: string
  }) {
    await this.metamaskPlaywright.renameAccount(currentAccountName, newAccountName)

    await this.metamaskExtensionPage.locator(HomePageSelectors.threeDotsMenu.accountDetailsCloseButton).click()

    await expect(
      this.metamaskExtensionPage.locator(this.metamaskPlaywright.homePage.selectors.accountMenu.accountButton)
    ).toHaveText(newAccountName)

    return true
  }

  async switchNetwork({
    networkName,
    isTestnet = false
  }: {
    networkName: string
    isTestnet?: boolean
  }) {
    return await this.metamaskPlaywright
      .switchNetwork(networkName, isTestnet)
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  async createAnvilNode(options?: CreateAnvilOptions) {
    pool = createPool()

    const nodeId = Array.from(pool.instances()).length
    const anvil = await pool.start(nodeId, options)

    const rpcUrl = `http://${anvil.host}:${anvil.port}`

    const DEFAULT_ANVIL_CHAIN_ID = 31337
    const chainId = options?.chainId ?? DEFAULT_ANVIL_CHAIN_ID

    return { anvil, rpcUrl, chainId }
  }

  async emptyAnvilNode() {
    await pool.empty()
    return true
  }

  async connectToAnvil({
    rpcUrl,
    chainId
  }: {
    rpcUrl: string
    chainId: number
  }) {
    try {
      await this.metamaskPlaywright.addNetwork({
        name: 'Anvil',
        rpcUrl,
        chainId,
        symbol: 'ETH',
        blockExplorerUrl: 'https://etherscan.io/'
      })

      await this.metamaskPlaywright.switchNetwork('Anvil')
      return true
    } catch (e) {
      console.error('Error connecting to Anvil network', e)
      return false
    }
  }

  async addNetwork(network: Network) {
    await this.metamaskPlaywright.addNetwork(network)

    await waitFor(
      () => this.metamaskExtensionPage.locator(HomePageSelectors.networkAddedPopover.switchToNetworkButton).isVisible(),
      3_000,
      false
    )

    await this.metamaskExtensionPage.locator(HomePageSelectors.networkAddedPopover.switchToNetworkButton).click()

    return true
  }

  // Token

  async deployToken() {
    await waitFor(
      () =>
        this.metamaskExtensionPage.locator(TransactionPage.nftApproveAllConfirmationPopup.approveButton).isVisible(),
      3_000,
      false
    )

    await this.metamaskPlaywright.confirmTransaction()

    return true
  }

  async addNewToken() {
    await this.metamaskPlaywright.addNewToken()

    await expect(this.metamaskExtensionPage.locator(Selectors.portfolio.singleToken).nth(1)).toContainText('TST')

    return true
  }

  async approveTokenPermission(options?: {
    spendLimit?: number | 'max'
    gasSetting?: GasSettings
  }) {
    return await this.metamaskPlaywright
      .approveTokenPermission(options)
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  async rejectTokenPermission() {
    await this.metamaskPlaywright.rejectTokenPermission()

    return true
  }

  // Network

  async approveNewNetwork() {
    await this.metamaskPlaywright.approveNewNetwork()

    return true
  }

  async approveSwitchNetwork() {
    await this.metamaskPlaywright.approveSwitchNetwork()

    return true
  }

  async rejectNewNetwork() {
    await this.metamaskPlaywright.rejectNewNetwork()

    return true
  }

  async rejectSwitchNetwork() {
    await this.metamaskPlaywright.rejectSwitchNetwork()

    return true
  }

  // Others

  async providePublicEncryptionKey() {
    return await this.metamaskPlaywright
      .providePublicEncryptionKey()
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  async decrypt() {
    return await this.metamaskPlaywright
      .decrypt()
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  async confirmSignature() {
    return await this.metamaskPlaywright
      .confirmSignature()
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  async rejectSignature() {
    await this.metamaskPlaywright.rejectSignature()

    return true
  }

  async confirmTransaction(options?: { gasSetting?: GasSettings }) {
    await waitFor(
      () =>
        this.metamaskExtensionPage.locator(TransactionPage.nftApproveAllConfirmationPopup.approveButton).isVisible(),
      5_000,
      false
    )

    await this.metamaskPlaywright.confirmTransaction(options)

    return true
  }

  async rejectTransaction() {
    await this.metamaskPlaywright.rejectTransaction()

    return true
  }

  async confirmTransactionAndWaitForMining() {
    await waitFor(
      () =>
        this.metamaskExtensionPage.locator(TransactionPage.nftApproveAllConfirmationPopup.approveButton).isVisible(),
      5_000,
      false
    )

    return this.metamaskPlaywright
      .confirmTransactionAndWaitForMining()
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  async openTransactionDetails(txIndex: number) {
    return this.metamaskPlaywright
      .openTransactionDetails(txIndex)
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  async closeTransactionDetails() {
    return this.metamaskPlaywright
      .closeTransactionDetails()
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  async goBackToHomePage() {
    await this.metamaskPlaywright.openSettings()

    await expect(this.metamaskExtensionPage.locator(HomePageSelectors.copyAccountAddressButton)).not.toBeVisible()

    await this.metamaskPlaywright.goBackToHomePage()

    await expect(this.metamaskExtensionPage.locator(HomePageSelectors.copyAccountAddressButton)).toBeVisible()
  }

  // Lock/Unlock

  async lock() {
    await this.metamaskPlaywright.lock()
    await expect(
      this.metamaskExtensionPage.locator(this.metamaskPlaywright.lockPage.selectors.submitButton)
    ).toBeVisible()

    return true
  }

  async unlock() {
    await this.metamaskPlaywright.unlock()
    await expect(this.metamaskExtensionPage.locator(this.metamaskPlaywright.homePage.selectors.logo)).toBeVisible()

    return true
  }
}
