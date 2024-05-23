import { ensureRdpPort } from '@synthetixio/synpress-core'

import { initEthereumWalletMock } from './initEthereumWalletMock'
import setupTasks from './setupTasks'

let port: number

export default function installSynpress(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
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

  setupTasks(on)

  return {
    ...config,
    browsers
  }
}
