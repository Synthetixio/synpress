import { createNameSelector } from '../../createNameSelector'

const recoveryStep = {
  secretRecoveryPhraseWord: (character: string) => createNameSelector(`mnemonic-${character}`)
}

const continueButton = "button:has-text('Continue')"
const doneButton = "button:has-text('Done')"

const passwordStep = {
  passwordInput: createNameSelector('initialPassword'),
  confirmPasswordInput: createNameSelector('confirmPassword'),
  acceptTermsCheckbox: "label:has-text('I agree to the')",
  continue: continueButton,
  doneButton
}

const allDone = 'text=Welcome to your wallet'

export default {
  recoveryStep,
  continueButton,
  passwordStep,
  allDone,
  doneButton
}
