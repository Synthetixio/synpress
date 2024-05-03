import { defineWalletSetup } from '@synthetixio/synpress-core'
import { testWithSynpress } from '@synthetixio/synpress-test'
import { MetaMask, getExtensionId, metaMaskFixtures } from '@synthetixio/synpress-metamask'
import { EthereumWalletMock, ethereumWalletMockFixtures } from '@synthetixio/ethereum-wallet-mock'

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
