import { createDataTestSelector } from '../../utils/selectors/createDataTestSelector'

export const UnlockPageSelectors = {
  passwordInput: createDataTestSelector('unlock-password'),
  submitButton: createDataTestSelector('unlock-submit')
}
