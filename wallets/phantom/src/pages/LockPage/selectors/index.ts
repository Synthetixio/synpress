const app = '#root'
const welcomePage = '#root'
const confirmButton = `${welcomePage} .first-time-flow__button`
const welcomePageElements = {
  app,
  welcomePage,
  confirmButton
}

const metametricsPage = '.metametrics-opt-in'
const optOutAnalyticsButton = `${metametricsPage} [data-testid="page-container-footer-cancel"]`

const metametricsPageElements = {
  metametricsPage,
  optOutAnalyticsButton
}

const firstTimeFlowPage = '.first-time-flow'
const importWalletButton = `[data-testid="import-wallet-button"]`
const importRecoveryPhraseButton = `[data-testid="import-seed-phrase-button"]`
const createWalletButton = `${firstTimeFlowPage} [data-testid="create-wallet-button"]`

const firstTimeFlowPageElements = {
  firstTimeFlowPage,
  importWalletButton,
  importRecoveryPhraseButton,
  createWalletButton
}

const firstTimeFlowImportPage = '.first-time-flow__import'
const newVaultForm = `${firstTimeFlowImportPage} .create-new-vault__form`
const secretWordsInput = (number: number) => `[data-testid="secret-recovery-phrase-word-input-${number}"]`
const confirmWordsButton = `[data-testid="onboarding-form-submit-button"]`
const passwordInput = `[data-testid="onboarding-form-password-input"]`
const confirmPasswordInput = `[data-testid="onboarding-form-confirm-password-input"]`
const termsCheckbox = `[data-testid="onboarding-form-terms-of-service-checkbox"]`
const continueAfterPasswordButton = '[data-testid="onboarding-form-submit-button"]'
const getStartedButton = '[data-testid="onboarding-form-submit-button"]'
const importButton = `${newVaultForm} .create-new-vault__submit-button`

const firstTimeFlowImportPageElements = {
  firstTimeFlowImportPage,
  newVaultForm,
  secretWordsInput,
  passwordInput,
  confirmPasswordInput,
  termsCheckbox,
  importButton,
  confirmWordsButton,
  continueAfterPasswordButton,
  getStartedButton
}

const firstTimeFlowCreatePage = '.first-time-flow'
const newPasswordInput = `${firstTimeFlowCreatePage} [data-testid="create-password"]`
const confirmNewPasswordInput = `${firstTimeFlowCreatePage} [data-testid="confirm-password"]`
const newSignupCheckbox = `${firstTimeFlowCreatePage} .first-time-flow__checkbox`
const createButton = `${firstTimeFlowCreatePage} .first-time-flow__button`

const firstTimeFlowCreatePagePageElements = {
  firstTimeFlowCreatePage,
  newPasswordInput,
  confirmNewPasswordInput,
  newSignupCheckbox,
  createButton
}

const secureYourWalletPage = '[data-testid="seed-phrase-intro"]'
const nextButton = `${secureYourWalletPage} button`

const secureYourWalletPageElements = {
  secureYourWalletPage,
  nextButton
}

const revealSeedPage = '[data-testid="reveal-seed-phrase"]'
const remindLaterButton = `${revealSeedPage} .first-time-flow__button`

const revealSeedPageElements = {
  revealSeedPage,
  remindLaterButton
}

const endOfFlowPage = '[data-testid="end-of-flow"]'
const allDoneButton = `${endOfFlowPage} [data-testid="EOF-complete-button"]`

const endOfFlowPageElements = {
  endOfFlowPage,
  allDoneButton
}

const unlockPageElements = {
  passwordInput: '[data-testid="unlock-form-password-input"]',
  unlockButton: '[data-testid="unlock-form-submit-button"]'
}

export const lockPageElements = {
  endOfFlowPageElements,
  revealSeedPageElements,
  secureYourWalletPageElements,
  firstTimeFlowCreatePagePageElements,
  firstTimeFlowImportPageElements,
  firstTimeFlowPageElements,
  metametricsPageElements,
  welcomePageElements,
  unlockPageElements
}
