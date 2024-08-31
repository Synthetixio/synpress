import type { BrowserContext, Page } from '@playwright/test'
import { ensureRdpPort } from '@synthetixio/synpress-core'
import type { CreateAnvilOptions } from '@viem/anvil'
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

export default function configureSynpress(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
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
      } = await importMetaMaskWallet(rdpPort)
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

  on('task', {
    // Synpress API

    // Account
    connectToDapp: () => metamask?.connectToDapp(),
    getAccount: () => metamask?.getAccount(),
    addNewAccount: (accountName: string) => metamask?.addNewAccount(accountName),
    switchAccount: (accountName: string) => metamask?.switchAccount(accountName),
    renameAccount: ({
      currentAccountName,
      newAccountName
    }: {
      currentAccountName: string
      newAccountName: string
    }) => metamask?.renameAccount({ currentAccountName, newAccountName }),

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

    // Anvil
    createAnvilNode: (options?: CreateAnvilOptions) => metamask?.createAnvilNode(options),
    emptyAnvilNode: () => metamask?.emptyAnvilNode(),

    // Token
    deployToken: () => metamask?.deployToken(),
    addNewToken: () => metamask?.addNewToken(),

    // Encryption
    providePublicEncryptionKey: () => metamask?.providePublicEncryptionKey(),
    decrypt: () => metamask?.decrypt(),

    // Transactions
    confirmSignature: () => metamask?.confirmSignature(),
    confirmTransaction: () => metamask?.confirmTransaction(),
    confirmTransactionAndWaitForMining: () => metamask?.confirmTransactionAndWaitForMining(),
    openTransactionDetails: (txIndex: number) => metamask?.openTransactionDetails(txIndex),
    closeTransactionDetails: () => metamask?.closeTransactionDetails()
  })

  return {
    ...config,
    browsers
  }
}