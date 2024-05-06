import { EthereumWalletMock, ethereumWalletMockFixtures } from '@synthetixio/ethereum-wallet-mock'
import { defineWalletSetup } from '@synthetixio/synpress-core'
import { MetaMask, getExtensionId, metaMaskFixtures } from '@synthetixio/synpress-metamask'
import { testWithSynpress } from '@synthetixio/synpress-test'

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