import { defineWalletSetup } from '@synthetixio/synpress-cache'
import { Phantom } from '../../../src/playwright'

export const SEED_PHRASE = 'test test test test test test test test test test test junk'
export const PASSWORD = 'Tester@1234'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const phantom = new Phantom(context, walletPage, PASSWORD)

  await phantom.importWallet(SEED_PHRASE)
})
