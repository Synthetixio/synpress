import { createDataTestSelector } from '../../createDataTestSelector'

export default {
  connectActionButton: `button${createDataTestSelector('primary-button')}:has-text("Connect")`,
  confirmActionButton: `button${createDataTestSelector('primary-button')}:has-text("Confirm")`,
  continueActionButton: `button${createDataTestSelector('primary-button')}:has-text("Continue")`,
  cancelActionButton: `button${createDataTestSelector('secondary-button')}:has-text("Cancel")`,
  closeActionButton: createDataTestSelector('button-close')
}
