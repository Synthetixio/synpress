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
const showHexDataToggleOn =
  '[data-testid="advanced-setting-hex-data"] .toggle-button--on';
const showHexDataToggleOff =
  '[data-testid="advanced-setting-hex-data"] .toggle-button--off';
const showTestnetConversionOn =
  'div.settings-page__content__modules > div.settings-page__body > div:nth-child(5) .toggle-button--on';
const showTestnetConversionOff =
  'div.settings-page__content__modules > div.settings-page__body > div:nth-child(5) .toggle-button--off';
const showTestnetNetworksOn =
  'div.settings-page__content__modules > div.settings-page__body > div:nth-child(6) .toggle-button--on';
const showTestnetNetworksOff =
  'div.settings-page__content__modules > div.settings-page__body > div:nth-child(6) .toggle-button--off';
const customNonceToggleOn =
  '[data-testid="advanced-setting-custom-nonce"] .toggle-button--on';
const customNonceToggleOff =
  '[data-testid="advanced-setting-custom-nonce"] .toggle-button--off';
const dismissBackupReminderOn =
  '[data-testid="advanced-setting-dismiss-reminder"] .toggle-button--on';
const dismissBackupReminderOff =
  '[data-testid="advanced-setting-dismiss-reminder"] .toggle-button--off';
const ethSignRequestsToggleOn =
  '[data-testid="advanced-setting-toggle-ethsign"] .toggle-button--on';
const ethSignRequestsToggleOff =
  '[data-testid="advanced-setting-toggle-ethsign"] .toggle-button--off';
module.exports.advancedPageElements = {
  resetAccountButton,
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
  ethSignRequestsToggleOn,
  ethSignRequestsToggleOff,
};

const improvedTokenAllowanceToggleOn =
  '.settings-page__content-row:nth-child(1) .toggle-button--on';
const improvedTokenAllowanceToggleOff =
  '.settings-page__content-row:nth-child(1) .toggle-button--off';
module.exports.experimentalSettingsPageElements = {
  improvedTokenAllowanceToggleOn,
  improvedTokenAllowanceToggleOff,
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
const symbolInput = `${addNetworkForm} [data-testid="network-form-ticker"] input`;
const blockExplorerInput = `${addNetworkForm} .form-field:nth-child(5) input`;
const saveButton = '.networks-tab__add-network-form-footer .btn-primary';
const switchButton = '.home__new-network-added__switch-to-button';
module.exports.addNetworkPageElements = {
  addNetworkForm,
  networkNameInput,
  rpcUrlInput,
  chainIdInput,
  symbolInput,
  blockExplorerInput,
  saveButton,
  switchButton,
};
