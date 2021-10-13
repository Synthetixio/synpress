const networkSwitcher = {
  button: '.network-display',
  networkName: '.typography',
  dropdownMenuItem: '.dropdown-menu-item',
  networkButton: number => `.dropdown-menu-item:nth-child(${3 + number})`,
};

const walletOverview = '.wallet-overview';
const popup = {
  container: '.popover-container',
  closeButton: '.popover-header__button',
};

const accountMenu = {
  button: '.account-menu__icon',
  accountButton: number => `.account-menu__account:nth-child(${number})`,
  accountName: '.account-menu__name',
  createAccountButton: '.account-menu__item--clickable:nth-child(6)',
  importAccountButton: '.account-menu__item--clickable:nth-child(7)',
  settingsButton: '.account-menu__item--clickable:nth-child(11)',
};

const optionsMenu = {
  button: '[data-testid=account-options-menu-button]',
  accountDetailsButton: '[data-testid="account-options-menu__account-details"]',
  connectedSitesButton: '[data-testid="account-options-menu__connected-sites"]',
};

const connectedSitesSelector = '.connected-sites';
const connectedSites = {
  modal: connectedSitesSelector,
  trashButton: `${connectedSitesSelector} .connected-sites-list__trash`,
  cancelButton: `${connectedSitesSelector} .btn-secondary`,
  disconnectButton: `${connectedSitesSelector} .btn-primary`,
  closeButton: `${connectedSitesSelector} [data-testid="popover-close"]`,
};

const accountModal = {
  walletAddressInput: '.account-modal input',
  closeButton: '.account-modal__close',
};

const importAccountSelector = '.new-account';
const importAccount = {
  page: importAccountSelector,
  input: `${importAccountSelector} #private-key-box`,
  cancelButton: `${importAccountSelector} .btn-default`,
  importButton: `${importAccountSelector} .btn-secondary`,
};

const createAccount = {
  page: importAccountSelector,
  input: `${importAccountSelector} .new-account-create-form__input`,
  cancelButton: `${importAccountSelector} .btn-default`,
  createButton: `${importAccountSelector} .btn-secondary`,
};

module.exports.mainPageElements = {
  networkSwitcher,
  walletOverview,
  popup,
  accountMenu,
  optionsMenu,
  connectedSites,
  accountModal,
  importAccount,
  createAccount,
};
