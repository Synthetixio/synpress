import { createDataTestSelector } from '../../../utils/selectors/createDataTestSelector'

const simpleMessage = {
  signButton: `.request-signature__footer ${createDataTestSelector('request-signature__sign')}`,
  rejectButton: '.request-signature__footer button.btn-secondary'
}

const structuredMessage = {
  scrollDownButton: `.signature-request-message ${createDataTestSelector('signature-request-scroll-button')}`,
  signButton: `.signature-request-footer ${createDataTestSelector('signature-sign-button')}`,
  rejectButton: `.signature-request-footer ${createDataTestSelector('signature-cancel-button')}`
}

export default {
  simpleMessage,
  structuredMessage
}
