import { readFileSync } from 'fs'
import { createRequire } from 'node:module'
import { test as base } from '@playwright/test'
import { MetaMaskMock, SEED_PHRASE } from './metamask-mock'
import type { Network } from './network/Network'
import { mockEthereum } from './utils'

const ANVIL_CHAIN_ID = 31337
const ANVIL_URL_URL = 'http://anvil:5000'

const require = createRequire(import.meta.url)
// Relative path to the web3-mock bundle
const web3MockPath = require.resolve('@depay/web3-mock/dist/umd/index.bundle.js')

export const testWithMetaMaskMock = base.extend<{
  metamask: MetaMaskMock
  createAnvilNetwork: () => Network
  deployToken: () => Promise<void>
}>({
  context: async ({ context }, use) => {
    // Dependency and mock function has to be added at the same time - https://playwright.dev/docs/api/class-browsercontext#browser-context-add-init-script
    await context.addInitScript({
      content: `${readFileSync(web3MockPath, 'utf-8')}\n(${mockEthereum.toString()})();`
    })

    await use(context)

    await context.close()
  },
  page: async ({ context }, use) => {
    const page = await context.newPage()

    await page.goto('/')

    await use(page)
  },
  metamask: async ({ page }, use) => {
    const metamask = new MetaMaskMock(page)

    metamask.importWallet(SEED_PHRASE)

    await use(metamask)
  },
  createAnvilNetwork: async ({ context: _ }, use) => {
    await use(() => {
      return {
        name: 'Anvil',
        rpcUrl: ANVIL_URL_URL,
        chainId: ANVIL_CHAIN_ID,
        blockExplorerUrl: 'https://etherscan.io/',
        nativeCurrency: {
          decimals: 18,
          name: 'Anvil',
          symbol: 'ETH'
        }
      }
    })
  }
})
