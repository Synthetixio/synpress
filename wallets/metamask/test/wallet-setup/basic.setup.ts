import type { BrowserContext, Page } from '@playwright/test'
import { defineWalletSetup } from '@synthetixio/synpress-utils'
import { MetaMask } from '../../src'

export const SEED_PHRASE = 'test test test test test test test test test test test junk'

export const PASSWORD = 'Tester@1234'

const basicSetup = defineWalletSetup(PASSWORD, async (context: BrowserContext, walletPage: Page) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD)

  await metamask.importWallet(SEED_PHRASE)
})

export default basicSetup
