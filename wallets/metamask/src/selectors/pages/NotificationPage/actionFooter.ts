import { createDataTestSelector } from '../../createDataTestSelector'

export default {
  confirmActionButton: `.page-container__footer ${createDataTestSelector('page-container-footer-next')}`,
  rejectActionButton: `.page-container__footer ${createDataTestSelector('page-container-footer-cancel')}`
}
