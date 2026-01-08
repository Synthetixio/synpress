import { createDataTestSelector } from '../../createDataTestSelector'

const recoveryStep = {
  selectNumberOfWordsDropdown: '.import-srp__number-of-words-dropdown > .dropdown__select',
  selectNumberOfWordsOption: (option: number | string) => `${option}`,
  secretRecoveryPhraseWord: (index: number) => createDataTestSelector(`import-srp__srp-word-${index}`),
  confirmSecretRecoveryPhraseButton: createDataTestSelector('import-srp-confirm'),
  error: '.mm-banner-alert.import-srp__srp-error div'
}

const passwordStep = {
  passwordInput: createDataTestSelector('create-password-new-input'),
  confirmPasswordInput: createDataTestSelector('create-password-confirm-input'),
  acceptTermsCheckbox: createDataTestSelector('create-password-terms'),
  importWalletButton: createDataTestSelector('create-password-submit'),
  error: `${createDataTestSelector('create-password-new-input')} + h6 > span > span`
}

export default {
  recoveryStep,
  passwordStep
}
