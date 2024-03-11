import { defineWalletSetup } from '@synthetixio/synpress-core'
import { MetaMask } from '../../../../src'

import { SEED_PHRASE, PASSWORD } from '../../../../src/constants'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD)

  await metamask.importWallet(SEED_PHRASE)
})
