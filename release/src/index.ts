import { EthereumWalletMock, ethereumWalletMockFixtures } from '@synthetixio/ethereum-wallet-mock'
import { defineWalletSetup } from '../../packages/cache'
import { MetaMask, getExtensionId, metaMaskFixtures } from '@synthetixio/synpress-metamask'
import { testWithSynpress } from '@synthetixio/synpress-core'

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
