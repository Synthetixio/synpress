import type { BrowserContext, Page } from '@playwright/test'
import { ensureRdpPort } from '@synthetixio/synpress-core'
import { MetaMask } from '../playwright'
import importMetaMaskWallet from './support/importMetaMaskWallet'
import { initMetaMask } from './support/initMetaMask'

let rdpPort: number
let context: BrowserContext
let metamaskExtensionId: string
let metamaskExtensionPage: Page

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
    const {
      context: _context,
      metamaskExtensionId: _metamaskExtensionId,
      extensionPage: _extensionPage
    } = await importMetaMaskWallet(rdpPort)
    if (_extensionPage && _metamaskExtensionId) {
      context = _context
      metamaskExtensionId = _metamaskExtensionId
      metamaskExtensionPage = _extensionPage
    }
  })

  on('task', {
    // Configuration helpers
    async importMetaMaskWallet() {
      return importMetaMaskWallet(rdpPort)
        .then(() => true)
        .catch(() => false)
    },
    async getBrowserContext() {
      return context
    },
    async getMetamaskExtensionId() {
      return metamaskExtensionId
    },
    async getMetamaskExtensionPage() {
      return metamaskExtensionPage
    },

    // Synpress API
    async connectToDapp() {
      const metamask = new MetaMask(
        context as BrowserContext,
        metamaskExtensionPage as Page,
        'password',
        metamaskExtensionId
      )

      return metamask
        .connectToDapp()
        .then(() => true)
        .catch(() => false)
    }
  })

  return {
    ...config,
    browsers
  }
}
