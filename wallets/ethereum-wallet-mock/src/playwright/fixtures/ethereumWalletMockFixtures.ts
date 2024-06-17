import { readFileSync } from 'fs'
import { test as base } from '@playwright/test'
import { SEED_PHRASE } from '../../constants'
import EthereumWalletMock from '../EthereumWalletMock'
import { mockEthereum, web3MockPath } from '../utils'

type EthereumWalletMockFixtures = {
  ethereumWalletMock: EthereumWalletMock
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
  ethereumWalletMock: async ({ page }, use) => {
    const ethereumWalletMock = new EthereumWalletMock(page)

    await ethereumWalletMock.importWallet(SEED_PHRASE)

    await use(ethereumWalletMock)
  }
})
