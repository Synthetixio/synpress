import { BrowserContext, Page } from '@playwright/test'
import { MetaMask, defineWalletSetup } from '@synthetixio/synpress'

const SEED_PHRASE = 'test test test test test test test test test test test junk'
const PASSWORD = 'SynpressIsAwesomeNow!!!'

export default defineWalletSetup(PASSWORD, async (context: BrowserContext, walletPage: Page) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD)

  await metamask.importWallet(SEED_PHRASE)
})
