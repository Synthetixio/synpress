const notificationPage = '.notification';
const loadingLogo = `${notificationPage} #loading__logo`;
const loadingSpinner = `${notificationPage} #loading__spinner`;
const nextButton = `${notificationPage} .permissions-connect-choose-account__bottom-buttons .btn-primary`;
const allowToSpendButton = `${notificationPage} [data-testid="page-container-footer-next"]`;
const rejectToSpendButton = `${notificationPage} [data-testid="page-container-footer-cancel"]`;
const selectAllCheckbox = `${notificationPage} .choose-account-list__header-check-box`;
module.exports.notificationPageElements = {
  notificationPage,
  loadingLogo,
  loadingSpinner,
  nextButton,
  allowToSpendButton,
  rejectToSpendButton,
  selectAllCheckbox,
};

const confirmSignatureRequestButton = `${notificationPage} .request-signature__footer__sign-button`;
const rejectSignatureRequestButton = `${notificationPage} .request-signature__footer__cancel-button`;
const signatureRequestScrollDownButton = `${notificationPage} [data-testid="signature-request-scroll-button"]`;
module.exports.signaturePageElements = {
  confirmSignatureRequestButton,
  rejectSignatureRequestButton,
  signatureRequestScrollDownButton,
};

const confirmDataSignatureRequestButton = `${notificationPage} [data-testid="signature-sign-button"]`;
const rejectDataSignatureRequestButton = `${notificationPage} [data-testid="signature-cancel-button"]`;
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

const confirmPageHeader = `${notificationPage} .confirm-page-container-header`;
const confirmPageContent = `${notificationPage} .confirm-page-container-content`;
const editGasFeeLegacyButton = `${notificationPage} .transaction-detail-edit button`;
const editGasFeeLegacyOverrideAckButton = `${notificationPage} .edit-gas-display .edit-gas-display__dapp-acknowledgement-button`;
const gasLimitLegacyInput = `${notificationPage} .edit-gas-popover__wrapper .edit-gas-display .advanced-gas-controls .form-field:nth-child(1) input`;
const gasPriceLegacyInput = `${notificationPage} .edit-gas-popover__wrapper .edit-gas-display .advanced-gas-controls .form-field:nth-child(2) input`;
const saveLegacyButton = `${notificationPage} .edit-gas-popover__wrapper .popover-footer .btn-primary`;
const editGasFeeButton = `${notificationPage} [data-testid="edit-gas-fee-button"]`;
const gasOptionLowButton = `${notificationPage} [data-testid="edit-gas-fee-item-low"]`;
const gasOptionMediumButton = `${notificationPage} [data-testid="edit-gas-fee-item-medium"]`;
const gasOptionHighButton = `${notificationPage} [data-testid="edit-gas-fee-item-high"]`;
const gasOptionDappSuggestedButton = `${notificationPage} [data-testid="edit-gas-fee-item-dapp-suggested"]`;
const gasOptionCustomButton = `${notificationPage} [data-testid="edit-gas-fee-item-custom"]`;
const baseFeeInput = `${notificationPage} [data-testid="base-fee-input"]`;
const priorityFeeInput = `${notificationPage} [data-testid="priority-fee-input"]`;
const editGasLimitButton = `${notificationPage} [data-testid="advanced-gas-fee-edit"]`;
const gasLimitInput = `${notificationPage} [data-testid="gas-limit-input"]`;
const saveCustomGasFeeButton = `${notificationPage} .popover-container .btn-primary`;
const totalLabel = `${confirmPageContent} .transaction-detail-item:nth-child(2) .transaction-detail-item__detail-values h6:nth-child(2)`; // todo: fix
const rejectButton = `${confirmPageContent} [data-testid="page-container-footer-cancel"]`;
const confirmButton = `${confirmPageContent} [data-testid="page-container-footer-next"]`;
module.exports.confirmPageElements = {
  notificationPage,
  confirmPageHeader,
  confirmPageContent,
  editGasFeeLegacyButton,
  editGasFeeLegacyOverrideAckButton,
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
  rejectButton,
  confirmButton,
};

const confirmEncryptionPublicKeyButton = `${notificationPage} .request-encryption-public-key__footer__sign-button`;
const rejectEncryptionPublicKeyButton = `${notificationPage} .request-encryption-public-key__footer__cancel-button`;
module.exports.encryptionPublicKeyPageElements = {
  confirmEncryptionPublicKeyButton,
  rejectEncryptionPublicKeyButton,
};

const confirmDecryptionRequestButton = `${notificationPage} .request-decrypt-message__footer__sign-button`;
const rejectDecryptionRequestButton = `${notificationPage} .request-decrypt-message__footer__cancel-button`;
module.exports.decryptPageElements = {
  confirmDecryptionRequestButton,
  rejectDecryptionRequestButton,
};
