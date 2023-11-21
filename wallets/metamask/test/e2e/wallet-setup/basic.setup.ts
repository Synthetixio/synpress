import { defineWalletSetup } from 'core'
import { MetaMask } from '../../../src'

const SEED_PHRASE = 'test test test test test test test test test test test junk'

const PASSWORD = 'Tester@1234'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD)

  await metamask.importWallet(SEED_PHRASE)

  // TODO: This should be automatically called when creating cache.
  await metamask.closeTooltipsIfAnyAreVisible()
})
