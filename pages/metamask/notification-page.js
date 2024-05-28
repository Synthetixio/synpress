const notificationPage = '.notification';
const notificationAppContent = `${notificationPage} #app-content .app`;
const loadingLogo = `${notificationPage} #loading__logo`;
const loadingSpinner = `${notificationPage} #loading__spinner`;
const nextButton = `${notificationPage} [data-testid="page-container-footer-next"]`;
const cancelButton = `${notificationPage} [data-testid="page-container-footer-cancel"]`;
const customSpendingLimitInput = `${notificationPage} [data-testid="custom-spending-cap-input"]`;
const allowToSpendButton = `${notificationPage} [data-testid="page-container-footer-next"]`;
const rejectToSpendButton = `${notificationPage} [data-testid="page-container-footer-cancel"]`;
const selectAllCheckbox = `${notificationPage} [data-testid="choose-account-list-operate-all-check-box"]`;
const approveWarningToSpendButton = `${notificationPage} .set-approval-for-all-warning__footer__approve-button`;
const rejectWarningToSpendButton = `${notificationPage} .set-approval-for-all-warning__footer__cancel-button`;

module.exports.notificationPageElements = {
  notificationPage,
  notificationAppContent,
  loadingLogo,
  loadingSpinner,
  nextButton,
  cancelButton,
  customSpendingLimitInput,
  allowToSpendButton,
  rejectToSpendButton,
  selectAllCheckbox,
  approveWarningToSpendButton,
  rejectWarningToSpendButton,
};

const confirmSignatureRequestButton = `${notificationPage} [data-testid="page-container-footer-next"]`;
const rejectSignatureRequestButton = `${notificationPage} [data-testid="page-container-footer-cancel"]`;
const signatureRequestScrollDownButton = `${notificationPage} [data-testid="signature-request-scroll-button"]`;
module.exports.signaturePageElements = {
  confirmSignatureRequestButton,
  rejectSignatureRequestButton,
  signatureRequestScrollDownButton,
};

const confirmDataSignatureRequestButton = `${notificationPage} [data-testid="page-container-footer-next"]`;
const rejectDataSignatureRequestButton = `${notificationPage} [data-testid="page-container-footer-cancel"]`;
module.exports.dataSignaturePageElements = {
  confirmDataSignatureRequestButton,
  rejectDataSignatureRequestButton,
  signatureRequestScrollDownButton,
};

const permissionsPage = '.permissions-connect';
const connectButton = `${permissionsPage} .permission-approval-container__footers .btn-primary`;
module.exports.permissionsPageElements = {
  permissionsPage,
  connectButton,
};

const popupContainer = '.mm-modal';
const popupCloseButton = `${popupContainer} [aria-label="Close"]`;
const popupCopyRecipientPublicAddressButton = `${popupContainer} [aria-label="Copy address to clipboard"]`;
const recipientPublicAddress = `${popupContainer} .mm-text-field--disabled input`;
module.exports.recipientPopupElements = {
  popupContainer,
  popupCloseButton,
  popupCopyRecipientPublicAddressButton,
  recipientPublicAddress,
};

const confirmPageHeader = `${notificationPage} .confirm-page-container-header`;
const confirmPageContent = `${notificationPage} .confirm-page-container-content`;
const networkLabel = `${confirmPageHeader} .network-display`;
const senderButton = `${confirmPageHeader} .sender-to-recipient__party--sender`;
const recipientButton = `${confirmPageHeader} .sender-to-recipient__party--recipient-with-address`;
const recipientAddressTooltipContainerButton = `${confirmPageHeader} .sender-to-recipient__party--recipient .sender-to-recipient__tooltip-container`;
const editGasFeeLegacyButton = `${notificationPage} .transaction-detail-edit button`;
const editGasFeeLegacyOverrideAckButton = `${notificationPage} .edit-gas-display .edit-gas-display__dapp-acknowledgement-button`;
const editGasLegacyPopup = `${notificationPage} .edit-gas-popover`;
const advancedLegacyGasControls = `${editGasLegacyPopup} .edit-gas-display .advanced-gas-controls`;
const gasLimitLegacyInput = `${advancedLegacyGasControls} .form-field:nth-child(1) input`;
const gasPriceLegacyInput = `${advancedLegacyGasControls} .form-field:nth-child(2) input`;
const saveLegacyButton = `${editGasLegacyPopup} .popover-footer .btn-primary`;
const editGasFeeButton = `${notificationPage} [data-testid="edit-gas-fee-icon"]`;
const gasOptionLowButton = `${notificationPage} [data-testid="edit-gas-fee-item-low"]`;
const gasOptionMediumButton = `${notificationPage} [data-testid="edit-gas-fee-item-medium"]`;
const gasOptionHighButton = `${notificationPage} [data-testid="edit-gas-fee-item-high"]`;
const gasOptionDappSuggestedButton = `${notificationPage} [data-testid="edit-gas-fee-item-dappSuggested"]`;
const gasOptionCustomButton = `${notificationPage} [data-testid="edit-gas-fee-item-custom"]`;
const baseFeeInput = `${notificationPage} [data-testid="base-fee-input"]`;
const priorityFeeInput = `${notificationPage} [data-testid="priority-fee-input"]`;
const editGasLimitButton = `${notificationPage} [data-testid="advanced-gas-fee-edit"]`;
const gasLimitInput = `${notificationPage} [data-testid="gas-limit-input"]`;
const saveCustomGasFeeButton = `${notificationPage} .mm-box--background-color-primary-default`;
const saveAdvanceCustomGasFeeButton = `${notificationPage} .advanced-gas-fee-popover .popover-footer button`;
const totalLabel = `${confirmPageContent} .transaction-detail-item:nth-child(2) .transaction-detail-item__detail-values h6:nth-child(2)`; // todo: fix
const customNonceInput = `${confirmPageContent} .custom-nonce-input input`;
const tabs = `${confirmPageContent} .tabs`;
const detailsButton = `${tabs} .tab:nth-child(1) button`;
const dataButton = `${tabs} .tab:nth-child(2) button`;
const dataTab = `${tabs} .confirm-page-container-content__data`;
const originValue = `${dataTab} .confirm-page-container-content__data-box:nth-child(1) .confirm-page-container-content__data-field:nth-child(1) div:nth-child(2)`;
const bytesValue = `${dataTab} .confirm-page-container-content__data-box:nth-child(1) .confirm-page-container-content__data-field:nth-child(2) div:nth-child(2)`;
const hexDataValue = `${dataTab} .confirm-page-container-content__data-box:nth-child(3)`;
const rejectButton = `${confirmPageContent} [data-testid="page-container-footer-cancel"]`;
const confirmButton = `${confirmPageContent} [data-testid="page-container-footer-next"]`;
module.exports.confirmPageElements = {
  notificationPage,
  confirmPageHeader,
  confirmPageContent,
  networkLabel,
  senderButton,
  recipientButton,
  recipientAddressTooltipContainerButton,
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
  saveAdvanceCustomGasFeeButton,
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
  confirmButton,
};

const confirmEncryptionPublicKeyButton = `${notificationPage} [data-testid="page-container-footer-next"]`;
const rejectEncryptionPublicKeyButton = `${notificationPage} [data-testid="page-container-footer-cancel"]`;
module.exports.encryptionPublicKeyPageElements = {
  confirmEncryptionPublicKeyButton,
  rejectEncryptionPublicKeyButton,
};

const confirmDecryptionRequestButton = `${notificationPage} [data-testid="page-container-footer-next"]`;
const rejectDecryptionRequestButton = `${notificationPage} [data-testid="page-container-footer-cancel"]`;
module.exports.decryptPageElements = {
  confirmDecryptionRequestButton,
  rejectDecryptionRequestButton,
};

const confirmAddTokenButton = `${notificationPage} .btn-primary`;
const rejectAddTokenButton = `${notificationPage} .btn-secondary`;
module.exports.addTokenPageElements = {
  confirmAddTokenButton,
  rejectAddTokenButton,
};
