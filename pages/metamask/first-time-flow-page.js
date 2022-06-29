const app = '#app-content .app';
const welcomePage = '.welcome-page';
const confirmButton = `${welcomePage} .first-time-flow__button`;
module.exports.welcomePageElements = {
  app,
  welcomePage,
  confirmButton,
};

const firstTimeFlowPage = '.first-time-flow';
const importWalletButton = `${firstTimeFlowPage} .select-action__select-button:nth-child(1) .first-time-flow__button`;
const createWalletButton = `${firstTimeFlowPage} .select-action__select-button:nth-child(2) .first-time-flow__button`;
module.exports.firstTimeFlowPageElements = {
  firstTimeFlowPage,
  importWalletButton,
  createWalletButton,
};

const metametricsPage = '.metametrics-opt-in';
const optOutAnalyticsButton = `${metametricsPage} [data-testid="page-container-footer-cancel"]`;
module.exports.metametricsPageElements = {
  metametricsPage,
  optOutAnalyticsButton,
};

const firstTimeFlowFormPage = '.first-time-flow__form';
const secretWordsInput = `${firstTimeFlowFormPage} .first-time-flow__seedphrase input`;
const passwordInput = `${firstTimeFlowFormPage} #password`;
const confirmPasswordInput = `${firstTimeFlowFormPage} #confirm-password`;
const termsCheckbox = `${firstTimeFlowFormPage} .first-time-flow__terms`;
const importButton = `${firstTimeFlowFormPage} .first-time-flow__button`;
const newPasswordInput = `${firstTimeFlowFormPage} #create-password`;
const newSignupCheckbox = `${firstTimeFlowFormPage} .first-time-flow__checkbox`;

module.exports.firstTimeFlowFormPageElements = {
  firstTimeFlowFormPage,
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

const endOfFlowPage = '.end-of-flow';
const allDoneButton = `${endOfFlowPage} .first-time-flow__button`;
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
