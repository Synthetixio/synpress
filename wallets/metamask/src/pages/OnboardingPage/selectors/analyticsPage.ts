import { createDataTestSelector } from '../../../utils/selectors/createDataTestSelector'

export default {
  optIn: createDataTestSelector('metametrics-i-agree'),
  optOut: createDataTestSelector('metametrics-no-thanks')
}
