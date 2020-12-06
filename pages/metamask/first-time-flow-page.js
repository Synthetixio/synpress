const app = '#app-content .app';

const welcomePage = '.welcome-page';
const confirmButton = `${welcomePage} .first-time-flow__button`;

const firstTimeFlowPage = '.first-time-flow';
const importWalletButton = `${firstTimeFlowPage} .first-time-flow__button`;

const metametricsPage = '.metametrics-opt-in';
const optOutAnalyticsButton = `${metametricsPage} [data-testid="page-container-footer-cancel"]`;

const firstTimeFlowFormPage = '.first-time-flow__form';
const secretWordsInput = `${firstTimeFlowFormPage} .first-time-flow__seedphrase input`;
const passwordInput = `${firstTimeFlowFormPage} #password`;
const confirmPasswordInput = `${firstTimeFlowFormPage} #confirm-password`;
const termsCheckbox = `${firstTimeFlowFormPage} .first-time-flow__terms`;
const importButton = `${firstTimeFlowFormPage} .first-time-flow__button`;

const endOfFlowPage = '.end-of-flow';
const allDoneButton = `${endOfFlowPage} .first-time-flow__button`;

const revealSeedPage = '.reveal-seed-phrase';
const remindLaterButton = `${revealSeedPage} .first-time-flow__button`;

export const welcomePageElements = {
  app,
  welcomePage,
  confirmButton,
};

export const firstTimeFlowPageElements = {
  firstTimeFlowPage,
  importWalletButton,
};

export const metametricsPageElements = {
  metametricsPage,
  optOutAnalyticsButton,
};

export const firstTimeFlowFormPageElements = {
  firstTimeFlowFormPage,
  secretWordsInput,
  passwordInput,
  confirmPasswordInput,
  termsCheckbox,
  importButton,
};

export const endOfFlowPageElements = {
  endOfFlowPage,
  allDoneButton,
};

export const revealSeedPageElements = {
  revealSeedPage,
  remindLaterButton,
};
