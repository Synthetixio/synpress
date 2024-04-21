import { EthereumWalletMock, testWithEthereumWalletMock } from '@synthetixio/ethereum-wallet-mock'
import { defineWalletSetup } from '@synthetixio/synpress-core'
import { getExtensionId, testWithSynpress } from '@synthetixio/synpress-fixtures'
import { MetaMask, homePageSelectors, unlockForFixture } from '@synthetixio/synpress-metamask'

export {
  // Framework fixtures
  testWithSynpress,
  testWithEthereumWalletMock,
  // API
  MetaMask,
  EthereumWalletMock,
  // Helpers
  defineWalletSetup,
  getExtensionId,
  unlockForFixture,
  homePageSelectors
}
