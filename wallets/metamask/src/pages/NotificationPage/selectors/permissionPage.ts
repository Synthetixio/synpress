import { createDataTestSelector } from '../../../utils/selectors/createDataTestSelector'

const approve = {
  maxButton: createDataTestSelector('custom-spending-cap-max-button'),
  customSpendingCapInput: createDataTestSelector('custom-spending-cap-input')
}

export default {
  approve
}
