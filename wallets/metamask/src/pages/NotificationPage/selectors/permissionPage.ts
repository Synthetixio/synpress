import { createDataTestSelector } from '../../../utils/selectors/createDataTestSelector'

const approve = {
  editPermission: {
    editPermissionButton:
      '.confirm-approve-content__edit-submission-button-container .confirm-approve-content__medium-link-text.cursor-pointer',
    customSpendLimitButton:
      '.edit-approval-permission-modal-content .edit-approval-permission__edit-section__option:last-of-type .edit-approval-permission__edit-section__radio-button',
    customSpendLimitInput:
      '.edit-approval-permission-modal-content .edit-approval-permission__edit-section__option-input input',
    saveButton: '.edit-approval-permission-modal-container .modal-container__footer > button.btn-primary'
  },
  confirmButton: `.page-container__footer ${createDataTestSelector('page-container-footer-next')}`,
  rejectButton: `.page-container__footer ${createDataTestSelector('page-container-footer-cancel')}`
}

export default {
  approve
}
