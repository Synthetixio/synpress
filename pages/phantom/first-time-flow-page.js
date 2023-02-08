const app = '#root';
const welcomePage = '#root';
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
const importWalletButton = `[data-testid="import-recovery-phrase-button"]`;
const createWalletButton = `${firstTimeFlowPage} [data-testid="create-wallet-button"]`;
module.exports.firstTimeFlowPageElements = {
  firstTimeFlowPage,
  importWalletButton,
  createWalletButton,
};

const firstTimeFlowImportPage = '.first-time-flow__import';
const newVaultForm = `${firstTimeFlowImportPage} .create-new-vault__form`;
const secretWordsInput = number =>
  `[data-testid="secret-recovery-phrase-word-input-${number}"]`;
const confirmWordsButton = `[data-testid="onboarding-form-submit-button"]`;
const passwordInput = `[data-testid="onboarding-form-password-input"]`;
const confirmPasswordInput = `[data-testid="onboarding-form-confirm-password-input"]`;
const termsCheckbox = `[data-testid="onboarding-form-terms-of-service-checkbox"]`;
const continueAfterPasswordButton =
  '[data-testid="onboarding-form-submit-button"]';
const continueOnShortcutConfirm =
  '[data-testid="onboarding-form-submit-button"]';
const importButton = `${newVaultForm} .create-new-vault__submit-button`;

module.exports.firstTimeFlowImportPageElements = {
  firstTimeFlowImportPage,
  newVaultForm,
  secretWordsInput,
  passwordInput,
  confirmPasswordInput,
  termsCheckbox,
  importButton,
  confirmWordsButton,
  continueAfterPasswordButton,
  continueOnShortcutConfirm,
};

const firstTimeFlowCreatePage = '.first-time-flow';
const newPasswordInput = `${firstTimeFlowCreatePage} [data-testid="create-password"]`;
const confirmNewPasswordInput = `${firstTimeFlowCreatePage} [data-testid="confirm-password"]`;
const newSignupCheckbox = `${firstTimeFlowCreatePage} .first-time-flow__checkbox`;
const createButton = `${firstTimeFlowCreatePage} .first-time-flow__button`;
module.exports.firstTimeFlowCreatePagePageElements = {
  firstTimeFlowCreatePage,
  newPasswordInput,
  confirmNewPasswordInput,
  newSignupCheckbox,
  createButton,
};

const secureYourWalletPage = '[data-testid="seed-phrase-intro"]';
const nextButton = `${secureYourWalletPage} button`;
module.exports.secureYourWalletPageElements = {
  secureYourWalletPage,
  nextButton,
};

const revealSeedPage = '[data-testid="reveal-seed-phrase"]';
const remindLaterButton = `${revealSeedPage} .first-time-flow__button`;
module.exports.revealSeedPageElements = {
  revealSeedPage,
  remindLaterButton,
};

const endOfFlowPage = '[data-testid="end-of-flow"]';
const allDoneButton = `${endOfFlowPage} [data-testid="EOF-complete-button"]`;
module.exports.endOfFlowPageElements = {
  endOfFlowPage,
  allDoneButton,
};
