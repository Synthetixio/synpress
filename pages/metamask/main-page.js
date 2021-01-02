const networkSwitcher = {
  button: '.ethereum-network',
  networkName: '.network-name',
  networkButton: number => `.dropdown-menu-item:nth-child(${3 + number})`,
};

const walletOverview = '.wallet-overview';
const popup = {
  container: '.popover-container',
  closeButton: '.popover-header__button',
};

const options = {
  button: '[data-testid=account-options-menu-button]',
  accountDetailsButton: '[data-testid="account-options-menu__account-details"]',
};

const accountModal = {
  walletAddressInput: '.account-modal input',
  closeButton: '.account-modal__close',
};

const mainPageElements = {
  networkSwitcher,
  walletOverview,
  popup,
  options,
  accountModal,
};

module.exports = {
  mainPageElements
}
