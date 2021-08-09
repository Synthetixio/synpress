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
  settingsButton: '.account-menu__item--clickable:nth-child(11)',
};

const optionsMenu = {
  button: '[data-testid=account-options-menu-button]',
  accountDetailsButton: '[data-testid="account-options-menu__account-details"]',
};

const accountModal = {
  walletAddressInput: '.account-modal input',
  closeButton: '.account-modal__close',
};

module.exports.mainPageElements = {
  networkSwitcher,
  walletOverview,
  popup,
  accountMenu,
  optionsMenu,
  accountModal,
};
