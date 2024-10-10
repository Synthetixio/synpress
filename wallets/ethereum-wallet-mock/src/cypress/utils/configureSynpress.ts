import { ensureRdpPort } from '@synthetixio/synpress-core'

import { initEthereumWalletMock } from './initEthereumWalletMock'

let port: number

/**
 * Configures Synpress for use with the Ethereum Wallet Mock.
 *
 * This function sets up the necessary configurations and hooks for running
 * Cypress tests with the Ethereum Wallet Mock. It performs the following tasks:
 *
 * 1. Filters the available browsers to ensure only Chrome is used.
 * 2. Sets up a 'before:browser:launch' hook to enable debug mode and establish
 *    a Playwright connection.
 * 3. Sets up a 'before:spec' hook to initialize the Ethereum Wallet Mock before
 *    each test spec runs.
 *
 * @param on - Cypress plugin event handler
 * @param config - Cypress plugin configuration options
 * @returns Modified Cypress configuration
 * @throws Error If no Chrome browser is found in the configuration
 */

export default function configureSynpress(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
  const browsers = config.browsers.filter((b) => b.name === 'chrome')
  if (browsers.length === 0) {
    throw new Error('No Chrome browser found in the configuration')
  }

  on('before:browser:launch', async (_, launchOptions) => {
    // Enable debug mode to establish playwright connection
    const args = Array.isArray(launchOptions) ? launchOptions : launchOptions.args
    port = ensureRdpPort(args)
  })

  on('before:spec', async () => {
    await initEthereumWalletMock(port)
  })

  return {
    ...config,
    browsers
  }
}
