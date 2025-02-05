import { createDataTestSelector } from '../../createDataTestSelector'

const recoveryStep = {
  selectNumberOfWordsDropdown: '.import-srp__number-of-words-dropdown > .dropdown__select',
  selectNumberOfWordsOption: (option: number | string) => `${option}`,
  // secretRecoveryPhraseWord: (index: number) => createDataTestSelector(`import-srp__srp-word-${index}`),
  secretRecoveryPhraseWord: (index: number) => createDataTestSelector(`secret-recovery-phrase-word-input-${index}`),
  // confirmSecretRecoveryPhraseButton:
  //   createDataTestSelector("import-srp-confirm"),
  confirmSecretRecoveryPhraseButton: createDataTestSelector('onboarding-form-submit-button'),
  // error: ".mm-banner-alert.import-srp__srp-error div",
  error: createDataTestSelector('onboarding-import-secret-recovery-phrase-error-message')
}

const viewAccountsButton = createDataTestSelector('onboarding-form-secondary-button')

const continueButton = createDataTestSelector('onboarding-form-submit-button')

const passwordStep = {
  passwordInput: createDataTestSelector('onboarding-form-password-input'),
  confirmPasswordInput: createDataTestSelector('onboarding-form-confirm-password-input'),
  acceptTermsCheckbox: createDataTestSelector('onboarding-form-terms-of-service-checkbox'),
  // importWalletButton: createDataTestSelector("onboarding-form-submit-button"),
  continue: continueButton,
  error: `${createDataTestSelector('create-password-new')} + h6 > span > span`
}

const allDone = `text=You're all done!`

export default {
  recoveryStep,
  viewAccountsButton,
  continueButton,
  passwordStep,
  allDone
}
