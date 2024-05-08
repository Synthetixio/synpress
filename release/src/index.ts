import { EthereumWalletMock, ethereumWalletMockFixtures } from '@synthetixio/ethereum-wallet-mock'
import { defineWalletSetup } from '@synthetixio/synpress-cache'
import { testWithSynpress } from '@synthetixio/synpress-core'
import { MetaMask, getExtensionId, metaMaskFixtures } from '@synthetixio/synpress-metamask'

export {
  // Framework fixtures
  testWithSynpress,
  ethereumWalletMockFixtures,
  metaMaskFixtures,
  // API
  MetaMask,
  EthereumWalletMock,
  // Helpers
  defineWalletSetup,
  getExtensionId
}
