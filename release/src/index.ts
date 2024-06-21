import { EthereumWalletMock, ethereumWalletMockFixtures } from '@synthetixio/ethereum-wallet-mock'
import { testWithSynpress } from '@synthetixio/synpress-core'
import { MetaMask, getExtensionId, metaMaskFixtures } from '@synthetixio/synpress-metamask'
import { defineWalletSetup } from '@synthetixio/synpress-utils'

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