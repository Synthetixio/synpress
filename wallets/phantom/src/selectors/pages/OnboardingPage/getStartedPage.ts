import { createDataTestSelector } from '../../createDataTestSelector'

export default {
  termsOfServiceCheckbox: createDataTestSelector('onboarding-terms-checkbox'),
  createNewWallet: `button:has-text("Create a new wallet")`,
  importWallet: 'text=I already have a wallet',
  importRecoveryPhraseButton: 'text=Import Secret Recovery Phrase'
}
