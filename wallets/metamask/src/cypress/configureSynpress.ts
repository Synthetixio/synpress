import type { BrowserContext, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { ensureRdpPort } from '@synthetixio/synpress-core'
import Selectors from '../selectors/pages/HomePage'
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
    async getAccount() {
      const metamask = getPlaywrightMetamask(context, metamaskExtensionPage, metamaskExtensionId)

      return await metamaskExtensionPage.locator(metamask.homePage.selectors.accountMenu.accountButton).innerText()
    },

    async getNetwork() {
      const metamask = getPlaywrightMetamask(context, metamaskExtensionPage, metamaskExtensionId)

      return await metamaskExtensionPage.locator(metamask.homePage.selectors.currentNetwork).innerText()
    },

    async connectToDapp(accounts?: string[]) {
      const metamask = getPlaywrightMetamask(context, metamaskExtensionPage, metamaskExtensionId)

      return metamask
        .connectToDapp(accounts)
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

    async switchAccount(accountName: string) {
      const metamask = getPlaywrightMetamask(context, metamaskExtensionPage, metamaskExtensionId)

      await metamask.switchAccount(accountName)

      await expect(metamaskExtensionPage.locator(metamask.homePage.selectors.accountMenu.accountButton)).toHaveText(
        accountName
      )

      return true
    },

    async renameAccount({
      currentAccountName,
      newAccountName
    }: {
      currentAccountName: string
      newAccountName: string
    }) {
      const metamask = getPlaywrightMetamask(context, metamaskExtensionPage, metamaskExtensionId)

      await metamask.renameAccount(currentAccountName, newAccountName)

      await metamaskExtensionPage.locator(Selectors.threeDotsMenu.accountDetailsCloseButton).click()

      await expect(metamaskExtensionPage.locator(metamask.homePage.selectors.accountMenu.accountButton)).toHaveText(
        newAccountName
      )

      return true
    },

    async switchNetwork({
      networkName,
      isTestnet
    }: {
      networkName: string
      isTestnet?: boolean
    }) {
      const metamask = getPlaywrightMetamask(context, metamaskExtensionPage, metamaskExtensionId)

      return await metamask
        .switchNetwork(networkName, isTestnet)
        .then(() => {
          return true
        })
        .catch(() => {
          return false
        })
    },

    async providePublicEncryptionKey() {
      const metamask = getPlaywrightMetamask(context, metamaskExtensionPage, metamaskExtensionId)

      return await metamask
        .providePublicEncryptionKey()
        .then(() => {
          return true
        })
        .catch(() => {
          return false
        })
    },

    async decrypt() {
      const metamask = getPlaywrightMetamask(context, metamaskExtensionPage, metamaskExtensionId)

      return await metamask
        .decrypt()
        .then(() => {
          return true
        })
        .catch(() => {
          return false
        })
    },

    async confirmSignature() {
      const metamask = getPlaywrightMetamask(context, metamaskExtensionPage, metamaskExtensionId)

      return await metamask
        .confirmSignature()
        .then(() => {
          return true
        })
        .catch(() => {
          return false
        })
    }
  })

  return {
    ...config,
    browsers
  }
}
