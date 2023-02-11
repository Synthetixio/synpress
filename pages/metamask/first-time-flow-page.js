const onboardingFlow = '.onboarding-flow';
const metametricsPage = `${onboardingFlow} [data-testid="onboarding-metametrics"]`;
const optOutAnalyticsButton = `${metametricsPage} [data-testid="metametrics-no-thanks"]`;
module.exports.metametricsPageElements = {
  metametricsPage,
  optOutAnalyticsButton,
};

const app = '#app-content .app';
const onboardingWelcomePage = `${onboardingFlow} [data-testid="onboarding-welcome"]`;
const importWalletButton = `${onboardingWelcomePage} [data-testid="onboarding-import-wallet"]`;
const createWalletButton = `${onboardingWelcomePage} [data-testid="onboarding-create-wallet"]`;
module.exports.onboardingWelcomePageElements = {
  app,
  onboardingWelcomePage,
  importWalletButton,
  createWalletButton,
};

const firstTimeFlowImportPage = `${onboardingFlow} [data-testid="import-srp"]`;
const secretWordsInput = number =>
  `${firstTimeFlowImportPage} [data-testid="import-srp__srp-word-${number}"]`;
const confirmSecretRecoverPhraseButton = `${firstTimeFlowImportPage} [data-testid="import-srp-confirm"]`;

const createPasswordPage = `${onboardingFlow} [data-testid="create-password"]`;
const passwordInput = `${createPasswordPage} [data-testid="create-password-new"]`;
const confirmPasswordInput = `${createPasswordPage} [data-testid="create-password-confirm"]`;
const termsCheckbox = `${createPasswordPage} [data-testid="create-password-terms"]`;
const importButton = `${createPasswordPage} [data-testid="create-password-import"]`;
module.exports.firstTimeFlowImportPageElements = {
  firstTimeFlowImportPage,
  secretWordsInput,
  confirmSecretRecoverPhraseButton,
  createPasswordPage,
  passwordInput,
  confirmPasswordInput,
  termsCheckbox,
  importButton,
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

const endOfFlowPage = `${onboardingFlow} [data-testid="creation-successful"]`;
const allDoneButton = `${endOfFlowPage} [data-testid="onboarding-complete-done"]`;
module.exports.endOfFlowPageElements = {
  endOfFlowPage,
  allDoneButton,
};

const pinExtensionPage = `${onboardingFlow} [data-testid="onboarding-pin-extension"]`;
const nextTabButton = `${pinExtensionPage} [data-testid="pin-extension-next"]`;
const doneButton = `${pinExtensionPage} [data-testid="pin-extension-done"]`;
module.exports.pinExtensionPageElements = {
  pinExtensionPage,
  nextTabButton,
  doneButton,
};
