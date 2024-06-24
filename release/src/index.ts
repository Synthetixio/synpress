import { testWithSynpress } from '@synthetixio/synpress-core'
import { MetaMask, getExtensionId, metaMaskFixtures } from '@synthetixio/synpress-metamask'
import { defineWalletSetup } from '@synthetixio/synpress-utils'

export {
  // Framework fixtures
  testWithSynpress,
  metaMaskFixtures,
  // API
  MetaMask,
  // Helpers
  defineWalletSetup,
  getExtensionId
}
