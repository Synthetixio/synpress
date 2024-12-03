import type { BrowserContext, Page } from '@playwright/test'
import { ensureRdpPort } from '@synthetixio/synpress-core'
import type { CreateAnvilOptions } from '@viem/anvil'
import type { SettingsSidebarMenus } from '../selectors/pages/HomePage/settings'
import type { GasSettings } from '../type/GasSettings'
import type { Network } from '../type/Network'
import MetaMask from './MetaMask'
import importMetaMaskWallet from './support/importMetaMaskWallet'
import { initMetaMask } from './support/initMetaMask'

let metamask: MetaMask

let rdpPort: number

let context: BrowserContext
let metamaskExtensionId: string

let metamaskExtensionPage: Page

// TODO: Implement if needed to change the focus between pages
// let cypressPage: Page

/**
 * Configures Synpress for use with MetaMask.
 *
 * This function sets up the necessary configurations and hooks for running
 * Cypress tests with MetaMask.
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
 *    a Playwright connection, and initialize MetaMask.
 * 3. Sets up a 'before:spec' hook to import the MetaMask wallet before
 *    each test spec runs.
 * 4. Provides task handlers for various MetaMask-related operations.
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
      const { extensions, browserArgs } = await initMetaMask()

      launchOptions.extensions.push(...extensions)
      args.push(...browserArgs)
    }

    return launchOptions
  })

  on('before:spec', async () => {
    if (!metamask) {
      const {
        context: _context,
        metamaskExtensionId: _metamaskExtensionId,
        extensionPage: _extensionPage,
        cypressPage: _cypressPage
      } = await importMetaMaskWallet(rdpPort, importDefaultWallet)
      if (_extensionPage && _metamaskExtensionId) {
        context = _context
        metamaskExtensionId = _metamaskExtensionId
        metamaskExtensionPage = _extensionPage
      }
      // TODO: Implement if needed to change the focus between pages
      // if (_cypressPage) {
      //   cypressPage = _cypressPage
      // }
      metamask = new MetaMask(context, metamaskExtensionPage, metamaskExtensionId)
    }
  })

  // Synpress API
  on('task', {
    // Wallet
    connectToDapp: () => metamask?.connectToDapp(),
    importWallet: (seedPhrase: string) => metamask?.importWallet(seedPhrase),
    importWalletFromPrivateKey: (privateKey: string) => metamask?.importWalletFromPrivateKey(privateKey),

    // Account
    getAccount: () => metamask?.getAccount(),
    getAccountAddress: () => metamask?.getAccountAddress(),
    addNewAccount: (accountName: string) => metamask?.addNewAccount(accountName),
    switchAccount: (accountName: string) => metamask?.switchAccount(accountName),
    renameAccount: ({
      currentAccountName,
      newAccountName
    }: {
      currentAccountName: string
      newAccountName: string
    }) => metamask?.renameAccount({ currentAccountName, newAccountName }),
    resetAccount: () => metamask?.resetAccount(),

    // Network
    getNetwork: () => metamask?.getNetwork(),
    switchNetwork: ({
      networkName,
      isTestnet = false
    }: {
      networkName: string
      isTestnet?: boolean
    }) =>
      metamask?.switchNetwork({
        networkName,
        isTestnet
      }),
    addNetwork: (network: Network) => metamask?.addNetwork(network),
    approveNewNetwork: () => metamask?.approveNewNetwork(),
    approveSwitchNetwork: () => metamask?.approveSwitchNetwork(),
    approveNewEthereumRPC: () => metamask?.approveNewEthereumRPC(),
    rejectNewNetwork: () => metamask?.rejectNewNetwork(),
    rejectSwitchNetwork: () => metamask?.rejectSwitchNetwork(),
    rejectNewEthereumRPC: () => metamask?.rejectNewEthereumRPC(),

    // Anvil
    createAnvilNode: (options?: CreateAnvilOptions) => metamask?.createAnvilNode(options),
    emptyAnvilNode: () => metamask?.emptyAnvilNode(),

    // Token
    deployToken: () => metamask?.deployToken(),
    addNewToken: () => metamask?.addNewToken(),
    approveTokenPermission: (options?: {
      spendLimit?: number | 'max'
      gasSetting?: GasSettings
    }) => metamask?.approveTokenPermission(options),
    rejectTokenPermission: () => metamask?.rejectTokenPermission(),

    // Encryption
    providePublicEncryptionKey: () => metamask?.providePublicEncryptionKey(),
    decrypt: () => metamask?.decrypt(),

    // Transactions
    confirmSignature: () => metamask?.confirmSignature(),
    rejectSignature: () => metamask?.rejectSignature(),
    confirmTransaction: (options?: { gasSetting?: GasSettings }) => metamask?.confirmTransaction(options),
    rejectTransaction: () => metamask?.rejectTransaction(),
    confirmTransactionAndWaitForMining: () => metamask?.confirmTransactionAndWaitForMining(),
    openTransactionDetails: (txIndex: number) => metamask?.openTransactionDetails(txIndex),
    closeTransactionDetails: () => metamask?.closeTransactionDetails(),

    // Lock/Unlock
    lock: () => metamask?.lock(),
    unlock: () => metamask?.unlock(),

    // Toggles
    toggleShowTestNetworks: () => metamask?.toggleShowTestNetworks(),
    toggleDismissSecretRecoveryPhraseReminder: () => metamask?.toggleDismissSecretRecoveryPhraseReminder(),

    // Others
    goBackToHomePage: () => metamask?.goBackToHomePage(),
    openSettings: () => metamask?.openSettings(),
    openSidebarMenu: (menu: SettingsSidebarMenus) => metamask?.openSidebarMenu(menu)
  })

  return {
    ...config,
    browsers
  }
}
