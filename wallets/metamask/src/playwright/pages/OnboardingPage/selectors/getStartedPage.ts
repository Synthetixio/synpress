import { createDataTestSelector } from '../../../utils/selectors/createDataTestSelector'

export default {
  termsOfServiceCheckbox: createDataTestSelector('onboarding-terms-checkbox'),
  createNewWallet: createDataTestSelector('onboarding-create-wallet'),
  importWallet: createDataTestSelector('onboarding-import-wallet')
}
