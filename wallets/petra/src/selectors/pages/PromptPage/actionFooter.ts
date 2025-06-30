import { createDataTestSelector } from '../../createDataTestSelector'

export default {
  connectActionButton: `button:has-text("Approve")`,
  confirmActionButton: `button${createDataTestSelector('primary-button')}:has-text("Confirm")`,
  continueActionButton: `button${createDataTestSelector('primary-button')}:has-text("Continue")`,
  cancelActionButton: `button:has-text("Cancel")`,
  closeActionButton: createDataTestSelector('button-close')
}
