const notificationPage = '.notification'
const notificationAppContent = `${notificationPage} #app-content .app`
const loadingLogo = `${notificationPage} #loading__logo`
const loadingSpinner = `${notificationPage} #loading__spinner`
const nextButton = `${notificationPage} .permissions-connect-choose-account__bottom-buttons .btn-primary`
const allowToSpendButton = `${notificationPage} [data-testid="page-container-footer-next"]`
const rejectToSpendButton = `${notificationPage} [data-testid="page-container-footer-cancel"]`
const selectAllCheckbox = `${notificationPage} .choose-account-list__header-check-box`

const notificationElements = {
  notificationPage,
  notificationAppContent,
  loadingLogo,
  loadingSpinner,
  nextButton,
  allowToSpendButton,
  rejectToSpendButton,
  selectAllCheckbox
}

const confirmSignatureRequestButton = `${notificationPage} .request-signature__footer__sign-button`
const rejectSignatureRequestButton = `${notificationPage} .request-signature__footer__cancel-button`
const signatureRequestScrollDownButton = `${notificationPage} [data-testid="signature-request-scroll-button"]`

const confirmDataSignatureRequestButton = `${notificationPage} [data-testid="signature-sign-button"]`
const rejectDataSignatureRequestButton = `${notificationPage} [data-testid="signature-cancel-button"]`

const dataSignaturePageElements = {
  confirmDataSignatureRequestButton,
  rejectDataSignatureRequestButton,
  signatureRequestScrollDownButton
}

const permissionsPage = '.permissions-connect'
const connectButton = `${permissionsPage} .permission-approval-container__footers .btn-primary`

const permissionsPageElements = {
  permissionsPage,
  connectButton
}

const popupContainer = '.popover-container'
const popupCloseButton = `${popupContainer} .popover-header__button`
const popupCopyRecipientPublicAddressButton = `${popupContainer} .nickname-popover__public-address button`
const recipientPublicAddress = `${popupContainer} .nickname-popover__public-address__constant`

const recipientPopupElements = {
  popupContainer,
  popupCloseButton,
  popupCopyRecipientPublicAddressButton,
  recipientPublicAddress
}

const confirmPageHeader = `${notificationPage} .confirm-page-container-header`
const confirmPageContent = `${notificationPage} .confirm-page-container-content`
const networkLabel = `${confirmPageHeader} .network-display`
const senderButton = `${confirmPageHeader} .sender-to-recipient__party--sender`
const recipientButton = `${confirmPageHeader} .sender-to-recipient__party--recipient-with-address`
const editGasFeeLegacyButton = `${notificationPage} .transaction-detail-edit button`
const editGasFeeLegacyOverrideAckButton = `${notificationPage} .edit-gas-display .edit-gas-display__dapp-acknowledgement-button`
const editGasLegacyPopup = `${notificationPage} .edit-gas-popover__wrapper`
const advancedLegacyGasControls = `${editGasLegacyPopup} .edit-gas-display .advanced-gas-controls`
const gasLimitLegacyInput = `${advancedLegacyGasControls} .form-field:nth-child(1) input`
const gasPriceLegacyInput = `${advancedLegacyGasControls} .form-field:nth-child(2) input`
const saveLegacyButton = `${editGasLegacyPopup} .popover-footer .btn-primary`
const editGasFeeButton = `${notificationPage} [data-testid="edit-gas-fee-button"]`
const gasOptionLowButton = `${notificationPage} [data-testid="edit-gas-fee-item-low"]`
const gasOptionMediumButton = `${notificationPage} [data-testid="edit-gas-fee-item-medium"]`
const gasOptionHighButton = `${notificationPage} [data-testid="edit-gas-fee-item-high"]`
const gasOptionDappSuggestedButton = `${notificationPage} [data-testid="edit-gas-fee-item-dappSuggested"]`
const gasOptionCustomButton = `${notificationPage} [data-testid="edit-gas-fee-item-custom"]`
const baseFeeInput = `${notificationPage} [data-testid="base-fee-input"]`
const priorityFeeInput = `${notificationPage} [data-testid="priority-fee-input"]`
const editGasLimitButton = `${notificationPage} [data-testid="advanced-gas-fee-edit"]`
const gasLimitInput = `${notificationPage} [data-testid="gas-limit-input"]`
const saveCustomGasFeeButton = `${notificationPage} .popover-container .btn-primary`
const totalLabel = `${confirmPageContent} .transaction-detail-item:nth-child(2) .transaction-detail-item__detail-values h6:nth-child(2)`
const customNonceInput = `${confirmPageContent} .custom-nonce-input input`
const tabs = `${confirmPageContent} .tabs`
const detailsButton = `${tabs} .tab:nth-child(1) button`
const dataButton = `${tabs} .tab:nth-child(2) button`
const dataTab = `${tabs} .confirm-page-container-content__data`
const originValue = `${dataTab} .confirm-page-container-content__data-box:nth-child(1) .confirm-page-container-content__data-field:nth-child(1) div:nth-child(2)`
const bytesValue = `${dataTab} .confirm-page-container-content__data-box:nth-child(1) .confirm-page-container-content__data-field:nth-child(2) div:nth-child(2)`
const hexDataValue = `${dataTab} .confirm-page-container-content__data-box:nth-child(3)`
const rejectButton = `${confirmPageContent} [data-testid="page-container-footer-cancel"]`
const confirmButton = `${confirmPageContent} [data-testid="page-container-footer-next"]`

const confirmPageElements = {
  notificationPage,
  confirmPageHeader,
  confirmPageContent,
  networkLabel,
  senderButton,
  recipientButton,
  editGasFeeLegacyButton,
  editGasFeeLegacyOverrideAckButton,
  editGasLegacyPopup,
  advancedLegacyGasControls,
  gasLimitLegacyInput,
  gasPriceLegacyInput,
  saveLegacyButton,
  editGasFeeButton,
  gasOptionLowButton,
  gasOptionMediumButton,
  gasOptionHighButton,
  gasOptionDappSuggestedButton,
  gasOptionCustomButton,
  baseFeeInput,
  priorityFeeInput,
  editGasLimitButton,
  gasLimitInput,
  saveCustomGasFeeButton,
  totalLabel,
  customNonceInput,
  tabs,
  detailsButton,
  dataButton,
  dataTab,
  originValue,
  bytesValue,
  hexDataValue,
  rejectButton,
  confirmButton
}

const confirmEncryptionPublicKeyButton = `${notificationPage} .request-encryption-public-key__footer__sign-button`
const rejectEncryptionPublicKeyButton = `${notificationPage} .request-encryption-public-key__footer__cancel-button`

const encryptionPublicKeyPageElements = {
  confirmEncryptionPublicKeyButton,
  rejectEncryptionPublicKeyButton
}

const confirmDecryptionRequestButton = `${notificationPage} .request-decrypt-message__footer__sign-button`
const rejectDecryptionRequestButton = `${notificationPage} .request-decrypt-message__footer__cancel-button`

const decryptPageElements = {
  confirmDecryptionRequestButton,
  rejectDecryptionRequestButton
}

const confirmAddTokenButton = `${notificationPage} .btn-primary`
const rejectAddTokenButton = `${notificationPage} .btn-secondary`

const addTokenPageElements = {
  confirmAddTokenButton,
  rejectAddTokenButton
}

/**
 * ADJUSTED
 */
const root = '#root'

const app = {
  root
}

const primaryButton = '[data-testid="primary-button"]'

const buttons = {
  primaryButton
}

/**
 * NEW
 */
const signaturePageElements = {
  buttons: {
    confirmSign: '[data-testid="primary-button"]',
    rejectSign: '[data-testid="secondary-button"]',
    signatureRequestScrollDownButton
  }
}

const transactionPageElements = {
  buttons: {
    confirmTransaction: '[data-testid="primary-button"]',
    rejectTransaction: '[data-testid="secondary-button"]'
  }
}

const menu = {
  buttons: {
    settings: '[data-testid="settings-menu-open-button"]',
    sidebar: {
      settings: '[data-testid="sidebar_menu-button-settings"]'
    }
  }
}

const incorrectModePageElements = {
  buttons: {
    close: '[data-testid="incorrect-mode"] button'
  }
}

const selectWalletElements = {
  buttons: {
    continueWithPhantom: '[data-testid="select_wallet--phantom"]',
    continueWithMetamask: '[data-testid="select_wallet--metamask"]'
  }
}

export const notificationPageElements = {
  notificationElements,
  incorrectModePageElements,
  menu,
  transactionPageElements,
  signaturePageElements,
  buttons,
  app,
  addTokenPageElements,
  decryptPageElements,
  encryptionPublicKeyPageElements,
  confirmPageElements,
  recipientPopupElements,
  dataSignaturePageElements,
  permissionsPage,
  permissionsPageElements,
  confirmSignatureRequestButton,
  rejectSignatureRequestButton,
  selectWalletElements
}
