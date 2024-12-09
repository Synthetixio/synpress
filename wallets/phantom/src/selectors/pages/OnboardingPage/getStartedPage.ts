import { createDataTestSelector } from '../../createDataTestSelector'

export default {
  termsOfServiceCheckbox: createDataTestSelector('onboarding-terms-checkbox'),
  createNewWallet: createDataTestSelector('onboarding-create-wallet'),
  // importWallet: createDataTestSelector('onboarding-import-wallet')
  importWallet: 'text=I already have a wallet',
  importRecoveryPhraseButton: 'text=Import Secret Recovery Phrase'
}
