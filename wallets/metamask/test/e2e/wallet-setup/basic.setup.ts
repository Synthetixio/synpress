import { defineWalletSetup } from 'core'
import { importWallet } from './utils/importWallet'

const SEED_PHRASE = 'test test test test test test test test test test test junk'

const PASSWORD = 'Tester@1234'

export default defineWalletSetup(PASSWORD, async (_, walletPage) => {
  await importWallet(walletPage, SEED_PHRASE, PASSWORD)
})
