import { testWithSynpress } from '@synthetixio/synpress-core'
import { keplrFixtures } from '../src'
import importWalletKeplr from './wallet-setup/import-wallet.setup'

export default testWithSynpress(keplrFixtures(importWalletKeplr))
