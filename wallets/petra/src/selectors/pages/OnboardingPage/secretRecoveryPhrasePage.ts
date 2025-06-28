import { createDataTestSelector } from '../../createDataTestSelector'
import { createNameSelector } from '../../createNameSelector'

const recoveryStep = {
  secretRecoveryPhraseWord: (character: string) => createNameSelector(`mnemonic-${character}`),
  error: createDataTestSelector('onboarding-import-secret-recovery-phrase-error-message')
}

const continueButton = "button:has-text('Continue')"
const doneButton = "button:has-text('Done')"

const passwordStep = {
  passwordInput: createNameSelector('initialPassword'),
  confirmPasswordInput: createNameSelector('confirmPassword'),
  acceptTermsCheckbox: "label:has-text('I agree to the')",
  continue: continueButton,
  doneButton,
  error: `${createDataTestSelector('create-password-new')} + h6 > span > span`
}

const allDone = 'text=Welcome to your wallet'

export default {
  recoveryStep,
  continueButton,
  passwordStep,
  allDone,
  doneButton
}
