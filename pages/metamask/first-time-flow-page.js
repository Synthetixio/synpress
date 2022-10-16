const app = '#app-content .app';
const welcomePage = '.welcome-page';
const confirmButton = `${welcomePage} .first-time-flow__button`;
module.exports.welcomePageElements = {
  app,
  welcomePage,
  confirmButton,
};

const metametricsPage = '.metametrics-opt-in';
const optOutAnalyticsButton = `${metametricsPage} [data-testid="page-container-footer-cancel"]`;
module.exports.metametricsPageElements = {
  metametricsPage,
  optOutAnalyticsButton,
};

const firstTimeFlowPage = '.first-time-flow';
const importWalletButton = `${firstTimeFlowPage} [data-testid="import-wallet-button"]`;
const createWalletButton = `${firstTimeFlowPage} [data-testid="create-wallet-button"]`;
module.exports.firstTimeFlowPageElements = {
  firstTimeFlowPage,
  importWalletButton,
  createWalletButton,
};

const firstTimeFlowImportPage = '.first-time-flow__import';
const newVaultForm = `${firstTimeFlowImportPage} .create-new-vault__form`;
const secretWordsInput = number =>
  `${newVaultForm} [data-testid="import-srp__srp-word-${number}"]`;
const passwordInput = `${newVaultForm} #password`;
const confirmPasswordInput = `${newVaultForm} #confirm-password`;
const termsCheckbox = `${newVaultForm} [data-testid="create-new-vault__terms-checkbox"]`;
const importButton = `${newVaultForm} .create-new-vault__submit-button`;
const newPasswordInput = `${newVaultForm} #create-password`;
const newSignupCheckbox = `${newVaultForm} .first-time-flow__checkbox`;

module.exports.firstTimeFlowImportPageElements = {
  firstTimeFlowImportPage,
  newVaultForm,
  secretWordsInput,
  passwordInput,
  confirmPasswordInput,
  termsCheckbox,
  importButton,
  newPasswordInput,
  newSignupCheckbox,
};

const secureYourWalletPage = '.seed-phrase-intro';
const nextButton = `${secureYourWalletPage} button`;
module.exports.secureYourWalletPageElements = {
  secureYourWalletPage,
  nextButton,
};

const endOfFlowPage = '[data-testid="end-of-flow"]';
const allDoneButton = `${endOfFlowPage} [data-testid="EOF-complete-button"]`;
module.exports.endOfFlowPageElements = {
  endOfFlowPage,
  allDoneButton,
};

const revealSeedPage = '.reveal-seed-phrase';
const remindLaterButton = `${revealSeedPage} .first-time-flow__button`;
module.exports.revealSeedPageElements = {
  revealSeedPage,
  remindLaterButton,
};
