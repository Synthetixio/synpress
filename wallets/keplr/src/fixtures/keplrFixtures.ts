import { test as base } from '@playwright/test'
import { KeplrWallet } from '../KeplrWallet'
import { SEED_PHRASE } from '../utils'

export const keplrFixtures = base.extend<{ keplrWallet: KeplrWallet }>({
  page: async ({ context }, use) => {
    const page = await context.newPage()

    await page.goto('/')

    await use(page)
  },
  keplrWallet: async ({ page }, use) => {
    const keplrWallet = new KeplrWallet(page)
    await keplrWallet.importWallet(SEED_PHRASE, 'password')
    await use(keplrWallet)
  },
})