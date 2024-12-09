const editGasFeeMenu = {
  editGasFeeButton: 'button:has-text("Network Fee")',
  slowGasFeeButton: 'div > div p:has-text("Slow")',
  fastGasFeeButton: 'div > div p:has-text("Fast")',
  saveButton: 'button:has-text("Save")'
}

const nftApproveAllConfirmationPopup = {
  approveButton: '.set-approval-for-all-warning__content button.set-approval-for-all-warning__footer__approve-button'
}

export default {
  editGasFeeMenu,
  nftApproveAllConfirmationPopup
}
