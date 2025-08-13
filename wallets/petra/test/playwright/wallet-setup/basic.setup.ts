import { defineWalletSetup } from '@synthetixio/synpress-cache'
import { Petra } from '../../../src/playwright'

export const SEED_PHRASE = 'test test test test test test test test test test test junk'
export const PASSWORD = 'Tester@1234'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const petra = new Petra(context, walletPage, PASSWORD)

  await petra.importWallet(SEED_PHRASE)
})
