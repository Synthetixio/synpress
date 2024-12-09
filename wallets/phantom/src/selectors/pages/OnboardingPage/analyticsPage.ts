import { createDataTestSelector } from '../../createDataTestSelector'

export default {
  optIn: createDataTestSelector('metametrics-i-agree'),
  optOut: createDataTestSelector('metametrics-no-thanks')
}
