import { type BrowserContext, type Page, expect } from '@playwright/test'
import { type Anvil, type CreateAnvilOptions, type Pool, createPool } from '@viem/anvil'
import { MetaMask as MetaMaskPlaywright } from '../playwright/MetaMask'
import { waitFor } from '../playwright/utils/waitFor'
import HomePageSelectors from '../selectors/pages/HomePage'
import Selectors from '../selectors/pages/HomePage'
import type { SettingsSidebarMenus } from '../selectors/pages/HomePage/settings'
import TransactionPage from '../selectors/pages/NotificationPage/transactionPage'
import type { GasSettings } from '../type/GasSettings'
import type { Network } from '../type/Network'
import getPlaywrightMetamask from './getPlaywrightMetamask'

let pool: Pool

/**
 * MetaMask class for interacting with the MetaMask extension in Cypress tests.
 */
export default class MetaMask {
  /** The MetaMask instance for Playwright */
  readonly metamaskPlaywright: MetaMaskPlaywright
  /** The MetaMask extension page */
  readonly metamaskExtensionPage: Page

  /**
   * Creates an instance of MetaMask.
   * @param context - The browser context
   * @param metamaskExtensionPage - The MetaMask extension page
   * @param metamaskExtensionId - The MetaMask extension ID
   */
  constructor(context: BrowserContext, metamaskExtensionPage: Page, metamaskExtensionId: string) {
    this.metamaskPlaywright = getPlaywrightMetamask(context, metamaskExtensionPage, metamaskExtensionId)
    this.metamaskExtensionPage = metamaskExtensionPage
  }

  /**
   * Gets the current account name.
   * @returns The current account name
   */
  async getAccount(): Promise<string> {
    return await this.metamaskExtensionPage
      .locator(this.metamaskPlaywright.homePage.selectors.accountMenu.accountButton)
      .innerText()
  }

  /**
   * Gets the current account address.
   * @returns The current account address
   */
  async getAccountAddress(): Promise<string> {
    return await this.metamaskPlaywright.getAccountAddress()
  }

  /**
   * Gets the current network name.
   * @returns The current network name
   */
  async getNetwork(): Promise<string> {
    return await this.metamaskExtensionPage
      .locator(this.metamaskPlaywright.homePage.selectors.currentNetwork)
      .innerText()
  }

  /**
   * Connects MetaMask to a dApp.
   * @param accounts - Optional array of account addresses to connect
   * @returns True if the connection was successful
   */
  async connectToDapp(accounts?: string[]): Promise<boolean> {
    await this.metamaskPlaywright.connectToDapp(accounts)
    return true
  }

  /**
   * Imports a wallet using a seed phrase.
   * @param seedPhrase - The seed phrase to import
   * @returns True if the import was successful
   */
  async importWallet(seedPhrase: string): Promise<boolean> {
    await this.metamaskPlaywright.importWallet(seedPhrase)
    return true
  }

  /**
   * Imports a wallet using a private key.
   * @param privateKey - The private key to import
   * @returns True if the import was successful
   */
  async importWalletFromPrivateKey(privateKey: string): Promise<boolean> {
    await this.metamaskPlaywright.importWalletFromPrivateKey(privateKey)
    return true
  }

  /**
   * Adds a new account with the given name.
   * @param accountName - The name for the new account
   * @returns True if the account was added successfully
   */
  async addNewAccount(accountName: string): Promise<boolean> {
    await this.metamaskPlaywright.addNewAccount(accountName)
    await expect(
      this.metamaskExtensionPage.locator(this.metamaskPlaywright.homePage.selectors.accountMenu.accountButton)
    ).toHaveText(accountName)
    return true
  }

  /**
   * Switches to the account with the given name.
   * @param accountName - The name of the account to switch to
   * @returns True if the switch was successful
   */
  async switchAccount(accountName: string): Promise<boolean> {
    await this.metamaskPlaywright.switchAccount(accountName)
    await expect(
      this.metamaskExtensionPage.locator(this.metamaskPlaywright.homePage.selectors.accountMenu.accountButton)
    ).toHaveText(accountName)
    return true
  }

  /**
   * Renames an account.
   * @param options - Object containing the current and new account names
   * @param options.currentAccountName - The current name of the account
   * @param options.newAccountName - The new name for the account
   * @returns True if the rename was successful
   */
  async renameAccount({
    currentAccountName,
    newAccountName
  }: {
    currentAccountName: string
    newAccountName: string
  }): Promise<boolean> {
    await this.metamaskPlaywright.renameAccount(currentAccountName, newAccountName)
    await this.metamaskExtensionPage.locator(HomePageSelectors.threeDotsMenu.accountDetailsCloseButton).click()
    await expect(
      this.metamaskExtensionPage.locator(this.metamaskPlaywright.homePage.selectors.accountMenu.accountButton)
    ).toHaveText(newAccountName)
    return true
  }

  /**
   * Resets the current account.
   * @returns True if the reset was successful
   */
  async resetAccount(): Promise<boolean> {
    await this.metamaskPlaywright.resetAccount()
    return true
  }

  /**
   * Switches to the specified network.
   * @param options - Object containing the network name and testnet flag
   * @param options.networkName - The name of the network to switch to
   * @param options.isTestnet - Whether the network is a testnet (default: false)
   * @returns True if the switch was successful, false otherwise
   */
  async switchNetwork({
    networkName,
    isTestnet = false
  }: {
    networkName: string
    isTestnet?: boolean
  }): Promise<boolean> {
    return await this.metamaskPlaywright
      .switchNetwork(networkName, isTestnet)
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  /**
   * Creates an Anvil node for testing.
   * @param options - Optional Anvil node creation options
   * @returns Object containing the Anvil instance, RPC URL, and chain ID
   */
  async createAnvilNode(options?: CreateAnvilOptions): Promise<{ anvil: Anvil; rpcUrl: string; chainId: number }> {
    pool = createPool()
    const nodeId = Array.from(pool.instances()).length
    const anvil = await pool.start(nodeId, options)
    const rpcUrl = `http://${anvil.host}:${anvil.port}`
    const DEFAULT_ANVIL_CHAIN_ID = 31337
    const chainId = options?.chainId ?? DEFAULT_ANVIL_CHAIN_ID
    return { anvil, rpcUrl, chainId }
  }

  /**
   * Empties the Anvil node pool.
   * @returns True if the operation was successful
   */
  async emptyAnvilNode(): Promise<boolean> {
    await pool.empty()
    return true
  }

  /**
   * Connects to an Anvil node.
   * @param options - Object containing the RPC URL and chain ID
   * @param options.rpcUrl - The RPC URL of the Anvil node
   * @param options.chainId - The chain ID of the Anvil node
   * @returns True if the connection was successful, false otherwise
   */
  async connectToAnvil({
    rpcUrl,
    chainId
  }: {
    rpcUrl: string
    chainId: number
  }): Promise<boolean> {
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

  /**
   * Adds a new network to MetaMask.
   * @param network - The network configuration to add
   * @returns True if the network was added successfully
   */
  async addNetwork(network: Network): Promise<boolean> {
    await this.metamaskPlaywright.addNetwork(network)
    await waitFor(
      () => this.metamaskExtensionPage.locator(HomePageSelectors.networkAddedPopover.switchToNetworkButton).isVisible(),
      3_000,
      false
    )
    await this.metamaskExtensionPage.locator(HomePageSelectors.networkAddedPopover.switchToNetworkButton).click()
    return true
  }

  /**
   * Deploys a token.
   * @returns True if the token was deployed successfully
   */
  async deployToken(): Promise<boolean> {
    await waitFor(
      () =>
        this.metamaskExtensionPage.locator(TransactionPage.nftApproveAllConfirmationPopup.approveButton).isVisible(),
      3_000,
      false
    )
    await this.metamaskPlaywright.confirmTransaction()
    return true
  }

  /**
   * Adds a new token to MetaMask.
   * @returns True if the token was added successfully
   */
  async addNewToken(): Promise<boolean> {
    await this.metamaskPlaywright.addNewToken()
    await expect(this.metamaskExtensionPage.locator(Selectors.portfolio.singleToken).nth(1)).toContainText('TST')
    return true
  }

  /**
   * Approves token permission.
   * @param options - Optional settings for token approval
   * @param options.spendLimit - The spend limit for the token (number or 'max')
   * @param options.gasSetting - Gas settings for the transaction
   * @returns True if the permission was approved, false otherwise
   */
  async approveTokenPermission(options?: {
    spendLimit?: number | 'max'
    gasSetting?: GasSettings
  }): Promise<boolean> {
    return await this.metamaskPlaywright
      .approveTokenPermission(options)
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  /**
   * Rejects token permission.
   * @returns True if the permission was rejected successfully
   */
  async rejectTokenPermission(): Promise<boolean> {
    await this.metamaskPlaywright.rejectTokenPermission()
    return true
  }

  /**
   * Approves adding a new network.
   * @returns True if the new network was approved successfully
   */
  async approveNewNetwork(): Promise<boolean> {
    await this.metamaskPlaywright.approveNewNetwork()
    return true
  }

  /**
   * Approves switching to a new network.
   * @returns True if the network switch was approved successfully
   */
  async approveSwitchNetwork(): Promise<boolean> {
    await this.metamaskPlaywright.approveSwitchNetwork()
    return true
  }

  /**
   * Rejects adding a new network.
   * @returns True if the new network was rejected successfully
   */
  async rejectNewNetwork(): Promise<boolean> {
    await this.metamaskPlaywright.rejectNewNetwork()
    return true
  }

  /**
   * Rejects switching to a new network.
   * @returns True if the network switch was rejected successfully
   */
  async rejectSwitchNetwork(): Promise<boolean> {
    await this.metamaskPlaywright.rejectSwitchNetwork()
    return true
  }

  /**
   * Approves adding a new RPC provider for Ethereum Mainnet.
   *
   * @returns True if the RPC provider was approved successfully
   */
  async approveNewEthereumRPC(): Promise<boolean> {
    await this.metamaskPlaywright.approveNewEthereumRPC()
    return true
  }

  /**
   * Rejects adding a new RPC provider for Ethereum Mainnet.
   *
   * @returns True if the RPC provider was rejected successfully
   */
  async rejectNewEthereumRPC(): Promise<boolean> {
    await this.metamaskPlaywright.rejectNewEthereumRPC()
    return true
  }

  /**
   * Locks the MetaMask wallet.
   * @returns True if the wallet was locked successfully
   */
  async lock(): Promise<boolean> {
    await this.metamaskPlaywright.lock()
    await expect(
      this.metamaskExtensionPage.locator(this.metamaskPlaywright.lockPage.selectors.submitButton)
    ).toBeVisible()
    return true
  }

  /**
   * Unlocks the MetaMask wallet.
   * @returns True if the wallet was unlocked successfully
   */
  async unlock(): Promise<boolean> {
    await this.metamaskPlaywright.unlock()
    await expect(this.metamaskExtensionPage.locator(this.metamaskPlaywright.homePage.selectors.logo)).toBeVisible()
    return true
  }

  /**
   * Provides a public encryption key.
   * @returns True if the key was provided successfully, false otherwise
   */
  async providePublicEncryptionKey(): Promise<boolean> {
    return await this.metamaskPlaywright
      .providePublicEncryptionKey()
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  /**
   * Decrypts a message.
   * @returns True if the message was decrypted successfully, false otherwise
   */
  async decrypt(): Promise<boolean> {
    return await this.metamaskPlaywright
      .decrypt()
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  /**
   * Confirms a signature request.
   * @returns True if the signature was confirmed successfully, false otherwise
   */
  async confirmSignature(): Promise<boolean> {
    return await this.metamaskPlaywright
      .confirmSignature()
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  /**
   * Rejects a signature request.
   * @returns True if the signature was rejected successfully
   */
  async rejectSignature(): Promise<boolean> {
    await this.metamaskPlaywright.rejectSignature()
    return true
  }

  /**
   * Confirms a transaction.
   * @param options - Optional gas settings for the transaction
   * @returns True if the transaction was confirmed successfully
   */
  async confirmTransaction(options?: {
    gasSetting?: GasSettings
  }): Promise<boolean> {
    await waitFor(
      () =>
        this.metamaskExtensionPage.locator(TransactionPage.nftApproveAllConfirmationPopup.approveButton).isVisible(),
      5_000,
      false
    )
    await this.metamaskPlaywright.confirmTransaction(options)
    return true
  }

  /**
   * Rejects a transaction.
   * @returns True if the transaction was rejected successfully
   */
  async rejectTransaction(): Promise<boolean> {
    await this.metamaskPlaywright.rejectTransaction()
    return true
  }

  /**
   * Confirms a transaction and waits for it to be mined.
   * @returns True if the transaction was confirmed and mined successfully, false otherwise
   */
  async confirmTransactionAndWaitForMining(): Promise<boolean> {
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

  /**
   * Opens the details of a specific transaction.
   * @param txIndex - The index of the transaction to open
   * @returns True if the transaction details were opened successfully, false otherwise
   */
  async openTransactionDetails(txIndex: number): Promise<boolean> {
    return this.metamaskPlaywright
      .openTransactionDetails(txIndex)
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  /**
   * Closes the transaction details view.
   * @returns True if the transaction details were closed successfully, false otherwise
   */
  async closeTransactionDetails(): Promise<boolean> {
    return this.metamaskPlaywright
      .closeTransactionDetails()
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  /**
   * Toggles the display of test networks.
   * @returns True if the toggle was successful
   */
  async toggleShowTestNetworks(): Promise<boolean> {
    await this.metamaskPlaywright.toggleShowTestNetworks()
    return true
  }

  /**
   * Toggles the dismissal of the secret recovery phrase reminder.
   * @returns True if the toggle was successful
   */
  async toggleDismissSecretRecoveryPhraseReminder(): Promise<boolean> {
    await this.metamaskPlaywright.toggleDismissSecretRecoveryPhraseReminder()
    return true
  }

  /**
   * Navigates back to the home page.
   * @returns True if the navigation was successful
   */
  async goBackToHomePage(): Promise<boolean> {
    await this.metamaskPlaywright.openSettings()
    await expect(this.metamaskExtensionPage.locator(HomePageSelectors.copyAccountAddressButton)).not.toBeVisible()
    await this.metamaskPlaywright.goBackToHomePage()
    await expect(this.metamaskExtensionPage.locator(HomePageSelectors.copyAccountAddressButton)).toBeVisible()
    return true
  }

  /**
   * Opens the settings page.
   * @returns True if the settings page was opened successfully
   */
  async openSettings(): Promise<boolean> {
    await this.metamaskPlaywright.openSettings()
    return true
  }

  /**
   * Opens a specific sidebar menu in the settings.
   * @param menu - The menu to open
   * @returns True if the menu was opened successfully
   */
  async openSidebarMenu(menu: SettingsSidebarMenus): Promise<boolean> {
    await this.metamaskPlaywright.openSidebarMenu(menu)
    await expect(this.metamaskExtensionPage.locator(HomePageSelectors.settings.sidebarMenu(menu))).toBeVisible()
    return true
  }
}
