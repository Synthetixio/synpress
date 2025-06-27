import { createDataTestSelector } from '../../createDataTestSelector'

const structuredMessage = {
  scrollDownButton: `.signature-request-message ${createDataTestSelector('signature-request-scroll-button')}`
}

const riskModal = {
  proceedAnyway: 'text=Proceed anyway (unsafe)',
  confirmUnsafe: 'text=Confirm (unsafe)',
  acknowledgeRisks: createDataTestSelector('acknowledge--button'),
  reconfirmUnsafe: 'text=Yes, confirm (unsafe)'
}

export default {
  structuredMessage,
  riskModal
}
