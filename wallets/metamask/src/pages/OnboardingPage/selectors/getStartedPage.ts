import { createDataTestSelector } from '../../../utils/selectors/createDataTestSelector'

export default {
  createNewWallet: createDataTestSelector('onboarding-create-wallet'),
  importWallet: createDataTestSelector('onboarding-import-wallet')
}
