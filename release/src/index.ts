import { defineWalletSetup } from "@synthetixio/synpress-core";
import {
  getExtensionId,
  testWithSynpress,
} from "@synthetixio/synpress-fixtures";
import {
  MetaMask,
  homePageSelectors,
  unlockForFixture,
} from "@synthetixio/synpress-metamask";
import {
  testWithMetaMaskMock,
  MetaMaskMock,
} from "@synthetixio/synpress-metamask-mock";

export {
  // Framework fixtures
  testWithSynpress,
  testWithMetaMaskMock,
  // API
  MetaMask,
  MetaMaskMock,
  // Helpers
  defineWalletSetup,
  getExtensionId,
  unlockForFixture,
  homePageSelectors,
};
