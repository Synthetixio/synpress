import { createDataTestSelector } from '../../createDataTestSelector'

const advancedGasFeeMenu = {
  maxBaseFeeInput: createDataTestSelector('base-fee-input'),
  priorityFeeInput: createDataTestSelector('priority-fee-input'),
  gasLimitEditButton: createDataTestSelector('advanced-gas-fee-edit'),
  gasLimitInput: createDataTestSelector('gas-limit-input'),
  gasLimitError: `div:has(> ${createDataTestSelector('gas-limit-input')}) + .form-field__error`,
  saveButton: '.popover-footer > button.btn-primary'
}

const lowGasFee = {
  button: createDataTestSelector('edit-gas-fee-item-low'),
  maxFee: `${createDataTestSelector('edit-gas-fee-item-low')} .edit-gas-item__fee-estimate`
}

const marketGasFee = {
  button: createDataTestSelector('edit-gas-fee-item-medium'),
  maxFee: `${createDataTestSelector('edit-gas-fee-item-medium')} .edit-gas-item__fee-estimate`
}

const aggressiveGasFee = {
  button: createDataTestSelector('edit-gas-fee-item-high'),
  maxFee: `${createDataTestSelector('edit-gas-fee-item-high')} .edit-gas-item__fee-estimate`
}

const editGasFeeMenu = {
  editGasFeeButton: createDataTestSelector('edit-gas-fee-icon'),
  editGasFeeButtonToolTip: '.edit-gas-fee-button .info-tooltip',
  lowGasFee,
  marketGasFee,
  aggressiveGasFee,
  siteSuggestedGasFeeButton: createDataTestSelector('edit-gas-fee-item-dappSuggested'),
  advancedGasFeeButton: createDataTestSelector('edit-gas-fee-item-custom'),
  advancedGasFeeMenu
}

const nftApproveAllConfirmationPopup = {
  approveButton: '.set-approval-for-all-warning__content button.set-approval-for-all-warning__footer__approve-button'
}

export default {
  editGasFeeMenu,
  nftApproveAllConfirmationPopup
}
