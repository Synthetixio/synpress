import { defineWalletSetup } from '@synthetixio/synpress-cache'
import { MetaMask } from '../../../src/playwright'

export const SEED_PHRASE = 'test test test test test test test test test test test junk'

export const PASSWORD = 'Tester@1234'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD)

  await metamask.importWallet(SEED_PHRASE)
})
