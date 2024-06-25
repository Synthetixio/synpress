import AnalyticsPageSelectors from './analyticsPage'
import GetStartedPageSelectors from './getStartedPage'
import PinExtensionPageSelectors from './pinExtensionPage'
import SecretRecoveryPhrasePageSelectors from './secretRecoveryPhrasePage'
import WalletCreationSuccessPageSelectors from './walletCreationSuccessPage'

// biome-ignore format: empty lines should be preserved
export default {
  // Initial Welcome Page
  GetStartedPageSelectors,

  // 2nd Page
  AnalyticsPageSelectors,

  // 3rd Page with two steps:
  // - Input Secret Recovery Phrase
  // - Create Password
  SecretRecoveryPhrasePageSelectors,

  // 4th Page
  WalletCreationSuccessPageSelectors,

  // 5th Page
  PinExtensionPageSelectors,
};
