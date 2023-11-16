import { createDataTestSelector } from '../../../utils/selectors/createDataTestSelector'

export default {
  confirmButton: `.page-container__footer ${createDataTestSelector('page-container-footer-next')}`,
  rejectButton: `.page-container__footer ${createDataTestSelector('page-container-footer-cancel')}`
}
