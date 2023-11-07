import { createDataTestSelector } from '../../../utils/selectors/createDataTestSelector'

const recoveryStep = {
  selectNumberOfWordsDropdown: '.import-srp__number-of-words-dropdown > .dropdown__select',
  selectNumberOfWordsOption: (option: number | string) => `${option}`,
  secretRecoveryPhraseWord: (index: number) => createDataTestSelector(`import-srp__srp-word-${index}`),
  confirmSecretRecoveryPhraseButton: createDataTestSelector('import-srp-confirm'),
  error: '.actionable-message.actionable-message--danger.import-srp__srp-error > .actionable-message__message'
}

const passwordStep = {
  passwordInput: createDataTestSelector('create-password-new'),
  confirmPasswordInput: createDataTestSelector('create-password-confirm'),
  acceptTermsCheckbox: createDataTestSelector('create-password-terms'),
  importWalletButton: createDataTestSelector('create-password-import'),
  error: `${createDataTestSelector('create-password-confirm')} + h6`
}

export default {
  recoveryStep,
  passwordStep
}
