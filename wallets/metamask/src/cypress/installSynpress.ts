import { ensureRdpPort } from '@synthetixio/synpress-core'
import { initMetaMask } from './support/initMetaMask'
import setupMetaMaskWallet from './support/setupMetaMaskWallet'

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

    args.push(...(await initMetaMask()))

    return launchOptions
  })

  on('before:spec', async () => {
    await setupMetaMaskWallet(port)
  })

  return {
    ...config,
    browsers
  }
}
