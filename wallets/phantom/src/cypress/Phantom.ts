import { type BrowserContext, type Page, expect } from '@playwright/test'
import { Phantom as PhantomPlaywright } from '../playwright/Phantom'
import { waitFor } from '../playwright/utils/waitFor'
import HomePageSelectors from '../selectors/pages/HomePage'
import TransactionPage from '../selectors/pages/NotificationPage/transactionPage'
import type { GasSettings } from '../type/GasSettings'
import type { Networks } from '../type/Networks'
import getPlaywrightPhantom from './getPlaywrightPhantom'

/**
 * Phantom class for interacting with the Phantom extension in Cypress tests.
 */
export default class Phantom {
  /** The Phantom instance for Playwright */
  readonly phantomPlaywright: PhantomPlaywright
  /** The Phantom extension page */
  readonly phantomExtensionPage: Page

  /**
   * Creates an instance of Phantom.
   * @param context - The browser context
   * @param phantomExtensionPage - The Phantom extension page
   * @param phantomExtensionId - The Phantom extension ID
   */
  constructor(context: BrowserContext, phantomExtensionPage: Page, phantomExtensionId: string) {
    this.phantomPlaywright = getPlaywrightPhantom(context, phantomExtensionPage, phantomExtensionId)
    this.phantomExtensionPage = phantomExtensionPage
  }

  /**
   * Gets the current account name.
   * @returns The current account name
   */
  async getAccount(): Promise<string> {
    return await this.phantomExtensionPage
      .locator(this.phantomPlaywright.homePage.selectors.accountMenu.accountName)
      .innerText()
  }

  /**
   * Gets the current account address.
   * @returns The current account address
   */
  async getAccountAddress(network: Networks): Promise<string> {
    return await this.phantomPlaywright.getAccountAddress(network)
  }

  /**
   * Connects Phantom to a dApp.
   * @param accounts - Optional array of account addresses to connect
   * @returns True if the connection was successful
   */
  async connectToDapp(account?: string): Promise<boolean> {
    await this.phantomPlaywright.connectToDapp(account)
    return true
  }

  /**
   * Imports a wallet using a seed phrase.
   * @param seedPhrase - The seed phrase to import
   * @returns True if the import was successful
   */
  async importWallet(seedPhrase: string): Promise<boolean> {
    await this.phantomPlaywright.importWallet(seedPhrase)
    return true
  }

  /**
   * Imports a wallet using a private key.
   * @param privateKey - The private key to import
   * @returns True if the import was successful
   */
  async importWalletFromPrivateKey(network: Networks, privateKey: string, walletName?: string): Promise<boolean> {
    await this.phantomPlaywright.importWalletFromPrivateKey(network, privateKey, walletName)
    return true
  }

  /**
   * Adds a new account with the given name.
   * @param accountName - The name for the new account
   * @returns True if the account was added successfully
   */
  async addNewAccount(accountName: string): Promise<boolean> {
    await this.phantomPlaywright.addNewAccount(accountName)
    await expect(
      this.phantomExtensionPage.locator(this.phantomPlaywright.homePage.selectors.accountMenu.accountName)
    ).toHaveText(accountName)
    return true
  }

  /**
   * Switches to the account with the given name.
   * @param accountName - The name of the account to switch to
   * @returns True if the switch was successful
   */
  async switchAccount(accountName: string): Promise<boolean> {
    await this.phantomPlaywright.switchAccount(accountName)
    await expect(
      this.phantomExtensionPage.locator(this.phantomPlaywright.homePage.selectors.accountMenu.accountName)
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
    await this.phantomPlaywright.renameAccount(currentAccountName, newAccountName)
    return true
  }

  /**
   * Resets the current account.
   * @returns True if the reset was successful
   */
  async resetApp(): Promise<boolean> {
    await this.phantomPlaywright.resetApp()
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
    return await this.phantomPlaywright
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
    await this.phantomPlaywright.rejectTokenPermission()
    return true
  }

  /**
   * Locks the Phantom wallet.
   * @returns True if the wallet was locked successfully
   */
  async lock(): Promise<boolean> {
    await this.phantomPlaywright.lock()
    await expect(
      this.phantomExtensionPage.locator(this.phantomPlaywright.lockPage.selectors.submitButton)
    ).toBeVisible()
    return true
  }

  /**
   * Unlocks the Phantom wallet.
   * @returns True if the wallet was unlocked successfully
   */
  async unlock(): Promise<boolean> {
    await this.phantomPlaywright.unlock()
    await expect(
      this.phantomExtensionPage.locator(this.phantomPlaywright.homePage.selectors.accountMenu.accountName)
    ).toBeVisible()
    return true
  }

  /**
   * Confirms a signature request.
   * @returns True if the signature was confirmed successfully, false otherwise
   */
  async confirmSignature(): Promise<boolean> {
    return await this.phantomPlaywright
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
    await this.phantomPlaywright.rejectSignature()
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
      () => this.phantomExtensionPage.locator(TransactionPage.nftApproveAllConfirmationPopup.approveButton).isVisible(),
      5_000,
      false
    )
    await this.phantomPlaywright.confirmTransaction(options)
    return true
  }

  /**
   * Rejects a transaction.
   * @returns True if the transaction was rejected successfully
   */
  async rejectTransaction(): Promise<boolean> {
    await this.phantomPlaywright.rejectTransaction()
    return true
  }

  /**
   * Toggles the display of test networks.
   * @returns True if the toggle was successful
   */
  async toggleTestnetMode(): Promise<boolean> {
    await this.phantomPlaywright.toggleTestnetMode()
    return true
  }

  /**
   * Navigates back to the home page.
   * @returns True if the navigation was successful
   */
  async goToHomePage(): Promise<boolean> {
    await this.phantomPlaywright.goToHomePage()
    return true
  }

  /**
   * Navigates back to the home page.
   * @returns True if the navigation was successful
   */
  async goBackToHomePage(): Promise<boolean> {
    await this.phantomPlaywright.openSettings()
    await expect(this.phantomExtensionPage.locator(HomePageSelectors.copyAccountAddressButton)).not.toBeVisible()
    await this.phantomPlaywright.goBackToHomePage()
    await expect(this.phantomExtensionPage.locator(HomePageSelectors.copyAccountAddressButton)).toBeVisible()
    return true
  }

  /**
   * Opens the settings page.
   * @returns True if the settings page was opened successfully
   */
  async openSettings(): Promise<boolean> {
    await this.phantomPlaywright.openSettings()
    return true
  }
}
