import { createDataTestSelector } from '../../createDataTestSelector'

export default {
  connectActionButton: `button${createDataTestSelector('primary-button')}:has-text("Connect")`,
  confirmActionButton: `button${createDataTestSelector('primary-button')}:has-text("Confirm")`,
  cancelActionButton: `button${createDataTestSelector('secondary-button')}:has-text("Cancel")`
}
