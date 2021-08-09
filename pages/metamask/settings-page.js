const settingsPage = {
  advancedButton: '.settings-page button:nth-child(2)',
  networksButton: '.settings-page button:nth-child(6)',
  closeButton: '.settings-page .settings-page__close-button',
};

const advancedPage = {
  customNonceToggleOn:
    '[data-testid="advanced-setting-custom-nonce"] .toggle-button--on input',
  customNonceToggleOff:
    '[data-testid="advanced-setting-custom-nonce"] .toggle-button--off input',
  resetAccountButton: '[data-testid="advanced-setting-reset-account"] button',
  resetAccountModal: {
    nevermindButton: '.modal-container button:nth-child(1)',
    resetButton: '.modal-container button:nth-child(2)',
  },
};

const networksPage = {
  addNetworkButton: '.networks-tab__body button',
};

const addNetworkPage = {
  networkNameInput: '#network-name',
  rpcUrlInput: '#rpc-url',
  chainIdInput: '#chainId',
  symbolInput: '#network-ticker',
  blockExplorerInput: '#block-explorer-url',
  saveButton: '.network-form__footer button:nth-child(2)',
};

module.exports.settingsPageElements = {
  settingsPage,
  advancedPage,
  networksPage,
  addNetworkPage,
};
