import { readFileSync } from 'fs'
import { createRequire } from 'node:module'
import { test as base } from '@playwright/test'
import { EthereumWalletMock } from '../EthereumWalletMock'
import { mockEthereum, SEED_PHRASE } from '../utils'

export const ANVIL_CHAIN_ID = 31337
export const ANVIL_URL_URL = 'http://anvil:5000'

const require = createRequire(import.meta.url)
// Relative path to the web3-mock bundle
const web3MockPath = require.resolve('@depay/web3-mock/dist/umd/index.bundle.js')

type EthereumWalletMockFixtures = {
  walletMock: EthereumWalletMock
}

export const ethereumWalletMockFixtures = base.extend<EthereumWalletMockFixtures>({
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
  walletMock: async ({ page }, use) => {
    const walletMock = new EthereumWalletMock(page)

    walletMock.importWallet(SEED_PHRASE)

    await use(walletMock)
  }
})
