import { defineWalletSetup } from '@synthetixio/synpress-cache'
import { testWithSynpress } from '@synthetixio/synpress-core'
import { MetaMask, getExtensionId, metaMaskFixtures } from '@synthetixio/synpress-metamask'

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
