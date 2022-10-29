const settingsPage = '.settings-page';
const advancedButton = `${settingsPage} button:nth-child(2)`;
const networksButton = `${settingsPage} button:nth-child(6)`;
const closeButton = `${settingsPage} .settings-page__header__title-container__close-button`;
module.exports.settingsPageElements = {
  settingsPage,
  advancedButton,
  networksButton,
  closeButton,
};

const resetAccountButton =
  '[data-testid="advanced-setting-reset-account"] button';
const advancedGasControlToggleOn =
  '[data-testid="advanced-setting-advanced-gas-inline"] .toggle-button--on';
const advancedGasControlToggleOff =
  '[data-testid="advanced-setting-advanced-gas-inline"] .toggle-button--off';
const enhancedTokenDetectionToggleOn =
  '[data-testid="advanced-setting-token-detection"] .toggle-button--on';
const enhancedTokenDetectionToggleOff =
  '[data-testid="advanced-setting-token-detection"] .toggle-button--off';
const showHexDataToggleOn =
  '[data-testid="advanced-setting-hex-data"] .toggle-button--on';
const showHexDataToggleOff =
  '[data-testid="advanced-setting-hex-data"] .toggle-button--off';
const showTestnetConversionOn =
  '[data-testid="advanced-setting-show-testnet-conversion"]:nth-child(7) .toggle-button--on';
const showTestnetConversionOff =
  '[data-testid="advanced-setting-show-testnet-conversion"]:nth-child(7) .toggle-button--off';
const showTestnetNetworksOn =
  '[data-testid="advanced-setting-show-testnet-conversion"]:nth-child(8) .toggle-button--on';
const showTestnetNetworksOff =
  '[data-testid="advanced-setting-show-testnet-conversion"]:nth-child(8) .toggle-button--off';
const customNonceToggleOn =
  '[data-testid="advanced-setting-custom-nonce"] .toggle-button--on';
const customNonceToggleOff =
  '[data-testid="advanced-setting-custom-nonce"] .toggle-button--off';
const dismissBackupReminderOn =
  '[data-testid="advanced-setting-dismiss-reminder"] .toggle-button--on';
const dismissBackupReminderOff =
  '[data-testid="advanced-setting-dismiss-reminder"] .toggle-button--off';
module.exports.advancedPageElements = {
  resetAccountButton,
  advancedGasControlToggleOn,
  advancedGasControlToggleOff,
  enhancedTokenDetectionToggleOn,
  enhancedTokenDetectionToggleOff,
  showHexDataToggleOn,
  showHexDataToggleOff,
  showTestnetConversionOn,
  showTestnetConversionOff,
  showTestnetNetworksOn,
  showTestnetNetworksOff,
  dismissBackupReminderOn,
  dismissBackupReminderOff,
  customNonceToggleOn,
  customNonceToggleOff,
};

const enhancedGasFeeUIToggleOn =
  '.settings-page__content-row:nth-child(1) .toggle-button--on';
const enhancedGasFeeUIToggleOff =
  '.settings-page__content-row:nth-child(1) .toggle-button--off';
module.exports.experimentalSettingsPageElements = {
  enhancedGasFeeUIToggleOn,
  enhancedGasFeeUIToggleOff,
};

const nevermindButton = '.modal-container .btn-secondary';
const resetButton = '.modal-container .btn-danger-primary';
module.exports.resetAccountModalElements = {
  nevermindButton,
  resetButton,
};

const addNetworkButton = '.networks-tab__body button';
module.exports.networksPageElements = { addNetworkButton };

const addNetworkForm = '.networks-tab__add-network-form-body';
const networkNameInput = `${addNetworkForm} .form-field:nth-child(1) input`;
const rpcUrlInput = `${addNetworkForm} .form-field:nth-child(2) input`;
const chainIdInput = `${addNetworkForm} .form-field:nth-child(3) input`;
const symbolInput = `${addNetworkForm} .form-field:nth-child(4) input`;
const blockExplorerInput = `${addNetworkForm} .form-field:nth-child(5) input`;
const saveButton = '.networks-tab__add-network-form-footer .btn-primary';
module.exports.addNetworkPageElements = {
  addNetworkForm,
  networkNameInput,
  rpcUrlInput,
  chainIdInput,
  symbolInput,
  blockExplorerInput,
  saveButton,
};
