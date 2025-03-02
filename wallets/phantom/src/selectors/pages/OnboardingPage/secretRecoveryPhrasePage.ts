import { createDataTestSelector } from '../../createDataTestSelector'

const recoveryStep = {
  secretRecoveryPhraseWord: (index: number) => createDataTestSelector(`secret-recovery-phrase-word-input-${index}`),
  confirmSecretRecoveryPhraseButton: createDataTestSelector('onboarding-form-submit-button'),
  error: createDataTestSelector('onboarding-import-secret-recovery-phrase-error-message')
}

const viewAccountsButton = createDataTestSelector('onboarding-form-secondary-button')

const continueButton = createDataTestSelector('onboarding-form-submit-button')

const passwordStep = {
  passwordInput: createDataTestSelector('onboarding-form-password-input'),
  confirmPasswordInput: createDataTestSelector('onboarding-form-confirm-password-input'),
  acceptTermsCheckbox: createDataTestSelector('onboarding-form-terms-of-service-checkbox'),
  continue: continueButton,
  error: `${createDataTestSelector('create-password-new')} + h6 > span > span`
}

const allDone = `text=You're all ready!`

export default {
  recoveryStep,
  viewAccountsButton,
  continueButton,
  passwordStep,
  allDone
}
