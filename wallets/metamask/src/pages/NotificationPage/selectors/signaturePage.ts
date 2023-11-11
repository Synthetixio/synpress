import { createDataTestSelector } from '../../../utils/selectors/createDataTestSelector'

export default {
  signButton: `.request-signature__footer ${createDataTestSelector('request-signature__sign')}`,
  rejectButton: '.request-signature__footer button.btn-secondary'
}
