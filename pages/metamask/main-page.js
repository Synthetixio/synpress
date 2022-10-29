const networkSwitcherButtonSelector = '.network-display';
const networkSwitcher = {
  button: networkSwitcherButtonSelector,
  networkName: `${networkSwitcherButtonSelector} .typography`,
  dropdownMenu: '[data-testid="network-droppo"]',
  dropdownMenuItem: `[data-testid="network-droppo"] .dropdown-menu-item`,
  mainnetNetworkItem: `[data-testid="network-droppo"] [data-testid="mainnet-network-item"]`,
  goerliNetworkItem: `[data-testid="network-droppo"] [data-testid="goerli-network-item"]`,
  sepoliaNetworkItem: `[data-testid="network-droppo"] [data-testid="sepolia-network-item"]`,
  localhostNetworkItem: `[data-testid="network-droppo"] [data-testid="Localhost 8545-network-item"]`,
  networkButton: number =>
    `[data-testid="network-droppo"] .dropdown-menu-item:nth-child(${
      3 + number
    })`,
};

const walletOverview = '.wallet-overview';
const popup = {
  container: '.popover-container',
  closeButton: '.popover-header__button',
  background: '.popover-bg',
};

const tippyTooltipSelector = '.tippy-popper';
const tippyTooltip = {
  container: tippyTooltipSelector,
  closeButton: `${tippyTooltipSelector} button`,
};

const actionableMessageSelector = '.actionable-message';
const actionableMessage = {
  container: actionableMessageSelector,
  closeButton: `${actionableMessageSelector} button`,
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
  disconnectLabel: `${connectedSitesSelector} .connected-sites-list__content-row-link-button`,
  cancelButton: `${connectedSitesSelector} .btn-secondary`,
  disconnectButton: `${connectedSitesSelector} .btn-primary`,
  closeButton: `${connectedSitesSelector} [data-testid="popover-close"]`,
};

const accountModal = {
  walletAddressInput: '.account-modal .qr-code__address',
  closeButton: '.account-modal__close',
};

const importAccountSelector = '.new-account';
const importAccount = {
  page: importAccountSelector,
  input: `${importAccountSelector} #private-key-box`,
  cancelButton: `${importAccountSelector} .new-account-create-form__button:nth-child(1)`,
  importButton: `${importAccountSelector} .new-account-create-form__button:nth-child(2)`,
};

const createAccount = {
  page: importAccountSelector,
  input: `${importAccountSelector} .new-account-create-form__input`,
  cancelButton: `${importAccountSelector} .new-account-create-form__button:nth-child(1)`,
  createButton: `${importAccountSelector} .new-account-create-form__button:nth-child(2)`,
};

module.exports.mainPageElements = {
  networkSwitcher,
  walletOverview,
  popup,
  tippyTooltip,
  actionableMessage,
  accountMenu,
  optionsMenu,
  connectedSites,
  accountModal,
  importAccount,
  createAccount,
};
