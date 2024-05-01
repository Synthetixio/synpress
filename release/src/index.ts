import { defineWalletSetup } from "@synthetixio/synpress-core";
import { testWithSynpress } from "@synthetixio/synpress-test";
import {
  MetaMask,
  homePageSelectors,
  unlockForFixture,
  getExtensionId,
} from "@synthetixio/synpress-metamask";
import {
  EthereumWalletMock,
  ethereumWalletMockFixtures,
} from "@synthetixio/ethereum-wallet-mock";

export {
  // Framework fixtures
  testWithSynpress,
  ethereumWalletMockFixtures,
  // API
  MetaMask,
  EthereumWalletMock,
  // Helpers
  defineWalletSetup,
  getExtensionId,
  unlockForFixture,
  homePageSelectors,
};
