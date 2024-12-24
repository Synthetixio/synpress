import type { BrowserContext, Page } from '@playwright/test'
import { ensureRdpPort } from '@synthetixio/synpress-core'
import type { GasSettings } from '../type/GasSettings'
import type { Networks } from '../type/Networks'
import Phantom from './Phantom'
import importPhantomWallet from './support/importPhantomWallet'
import { initPhantom } from './support/initPhantom'

let phantom: Phantom

let rdpPort: number

let context: BrowserContext
let phantomExtensionId: string

let phantomExtensionPage: Page

// TODO: Implement if needed to change the focus between pages
// let cypressPage: Page

/**
 * Configures Synpress for use with Phantom.
 *
 * This function sets up the necessary configurations and hooks for running
 * Cypress tests with Phantom.
 *
 * @param on - Cypress plugin event handler
 * @param config - Cypress plugin configuration options
 * @param importDefaultWallet - Whether to import the default wallet
 * @returns Modified Cypress configuration
 * @throws Error If no Chrome browser is found in the configuration
 *
 * @remarks
 * This function performs the following tasks:
 *
 * 1. Filters the available browsers to ensure only Chrome is used.
 * 2. Sets up a 'before:browser:launch' hook to enable debug mode, establish
 *    a Playwright connection, and initialize Phantom.
 * 3. Sets up a 'before:spec' hook to import the Phantom wallet before
 *    each test spec runs.
 * 4. Provides task handlers for various Phantom-related operations.
 *
 * @example
 * ```typescript
 * import { configureSynpress } from './configureSynpress';
 *
 * export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
 *   return configureSynpress(on, config);
 * };
 * ```
 */

export default function configureSynpress(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
  importDefaultWallet = true
) {
  const browsers = config.browsers.filter((b) => b.name === 'chrome')
  if (browsers.length === 0) {
    throw new Error('No Chrome browser found in the configuration')
  }

  on('before:browser:launch', async (browser, launchOptions) => {
    // Enable debug mode to establish playwright connection
    const args = Array.isArray(launchOptions) ? launchOptions : launchOptions.args
    rdpPort = ensureRdpPort(args)

    if (browser.family === 'chromium') {
      const { extensions, browserArgs } = await initPhantom()

      launchOptions.extensions.push(...extensions)
      args.push(...browserArgs)
    }

    return launchOptions
  })

  on('before:spec', async () => {
    if (!phantom) {
      const {
        context: _context,
        phantomExtensionId: _phantomExtensionId,
        extensionPage: _extensionPage,
        cypressPage: _cypressPage
      } = await importPhantomWallet(rdpPort, importDefaultWallet)
      if (_extensionPage && _phantomExtensionId) {
        context = _context
        phantomExtensionId = _phantomExtensionId
        phantomExtensionPage = _extensionPage
      }
      // TODO: Implement if needed to change the focus between pages
      // if (_cypressPage) {
      //   cypressPage = _cypressPage
      // }
      phantom = new Phantom(context, phantomExtensionPage, phantomExtensionId)
    }
  })

  // Synpress API
  on('task', {
    // Wallet
    connectToDapp: () => phantom?.connectToDapp(),
    importWallet: (seedPhrase: string) => phantom?.importWallet(seedPhrase),
    importWalletFromPrivateKey: ({
      network,
      privateKey,
      walletName
    }: {
      network: Networks
      privateKey: string
      walletName?: string
    }) => phantom?.importWalletFromPrivateKey(network, privateKey, walletName),

    // Account
    getAccount: () => phantom?.getAccount(),
    getAccountAddress: (network: Networks) => phantom?.getAccountAddress(network),
    addNewAccount: (accountName: string) => phantom?.addNewAccount(accountName),
    switchAccount: (accountName: string) => phantom?.switchAccount(accountName),
    renameAccount: ({
      currentAccountName,
      newAccountName
    }: {
      currentAccountName: string
      newAccountName: string
    }) => phantom?.renameAccount({ currentAccountName, newAccountName }),
    resetApp: () => phantom?.resetApp(),

    // Token
    approveTokenPermission: (options?: {
      spendLimit?: number | 'max'
      gasSetting?: GasSettings
    }) => phantom?.approveTokenPermission(options),
    rejectTokenPermission: () => phantom?.rejectTokenPermission(),

    // Transactions
    confirmSignature: () => phantom?.confirmSignature(),
    rejectSignature: () => phantom?.rejectSignature(),
    confirmTransaction: (options?: { gasSetting?: GasSettings }) => phantom?.confirmTransaction(options),
    rejectTransaction: () => phantom?.rejectTransaction(),

    // Lock/Unlock
    lock: () => phantom?.lock(),
    unlock: () => phantom?.unlock(),

    // Toggles
    toggleTestnetMode: () => phantom?.toggleTestnetMode(),

    // Others
    goToHomePage: () => phantom?.goToHomePage(),
    goBackToHomePage: () => phantom?.goBackToHomePage(),
    openSettings: () => phantom?.openSettings()
  })

  return {
    ...config,
    browsers
  }
}
