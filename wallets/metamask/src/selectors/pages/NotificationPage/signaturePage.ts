import { createDataTestSelector } from '../../createDataTestSelector'

const simpleMessage = {
  signButton: `.request-signature__footer ${createDataTestSelector('request-signature__sign')}`,
  rejectButton: '.request-signature__footer button.btn-secondary'
}

const structuredMessage = {
  scrollDownButton: `.signature-request-message ${createDataTestSelector('signature-request-scroll-button')}`,
  signButton: `.signature-request-footer ${createDataTestSelector('signature-sign-button')}`,
  rejectButton: `.signature-request-footer ${createDataTestSelector('signature-cancel-button')}`
}

const riskModal = {
  signButton: createDataTestSelector('signature-warning-sign-button')
}

export default {
  simpleMessage,
  structuredMessage,
  riskModal
}
