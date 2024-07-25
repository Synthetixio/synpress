import type { BrowserContext, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { ensureRdpPort } from '@synthetixio/synpress-core'
import getPlaywrightMetamask from './getPlaywrightMetamask'
import importMetaMaskWallet from './support/importMetaMaskWallet'
import { initMetaMask } from './support/initMetaMask'

let metamaskInitialized = false

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
    if (!metamaskInitialized) {
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
      metamaskInitialized = true
    }
  })

  on('task', {
    // Synpress API
    async connectToDapp() {
      const metamask = getPlaywrightMetamask(context, metamaskExtensionPage, metamaskExtensionId)

      return metamask
        .connectToDapp()
        .then(() => true)
        .catch(() => false)
    },

    async addNewAccount(accountName: string) {
      const metamask = getPlaywrightMetamask(context, metamaskExtensionPage, metamaskExtensionId)

      await metamask.addNewAccount(accountName)

      await expect(metamaskExtensionPage.locator(metamask.homePage.selectors.accountMenu.accountButton)).toHaveText(
        accountName
      )

      return true
    },

    async getAccount() {
      const metamask = getPlaywrightMetamask(context, metamaskExtensionPage, metamaskExtensionId)

      return await metamaskExtensionPage.locator(metamask.homePage.selectors.accountMenu.accountButton).innerText()
    }
  })

  return {
    ...config,
    browsers
  }
}
