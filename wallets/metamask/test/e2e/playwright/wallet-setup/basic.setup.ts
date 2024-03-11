import { defineWalletSetup } from '@synthetixio/synpress-core'
import { MetaMask } from '../../../../src'

import { PASSWORD, SEED_PHRASE } from '../../../../src/constants'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD)

  await metamask.importWallet(SEED_PHRASE)
})
