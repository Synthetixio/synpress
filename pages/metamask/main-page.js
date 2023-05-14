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

const tabs = {
  assetsButton: '[data-testid="home__asset-tab"] button',
  activityButton: '[data-testid="home__activity-tab"] button',
};

const transactionList = '.transaction-list__transactions';
const pendingTransactionsList = `${transactionList} .transaction-list__pending-transactions`;
const completedTransactionsList = `${transactionList} .transaction-list__completed-transactions`;
const activityTab = {
  transactionList,
  pendingTransactionsList,
  completedTransactionsList,
  unconfirmedTransaction: `${pendingTransactionsList} .transaction-list-item--unconfirmed`,
  confirmedTransaction: `${completedTransactionsList} .transaction-list-item`,
};

const popupSelector = '.popover-container';
const sendPopupSelector = `${popupSelector} .transaction-list-item-details`;
const popup = {
  container: popupSelector,
  closeButton: '.popover-header__button',
  background: '.popover-bg',
  sendPopup: {
    container: sendPopupSelector,
    speedUpButton: `${sendPopupSelector} .btn-primary`,
    cancelButton: `${sendPopupSelector} .btn-secondary`,
    transactionStatus: `${sendPopupSelector} .transaction-status`,
    copyTxIdButton: `${sendPopupSelector} .transaction-list-item-details__tx-hash .transaction-list-item-details__header-button a`,
    // todo:
  },
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
  createAccountError: `${importAccountSelector} .new-account-create-form__error`,
};

const importTokenFormSelector = '.import-token__custom-token-form';
const importToken = {
  form: importTokenFormSelector,
  tokenContractAddressInput: `${importTokenFormSelector} #custom-address`,
  tokenSymbolInput: `${importTokenFormSelector} #custom-symbol`,
  tokenEditButton: `${importTokenFormSelector} .import-token__custom-symbol__edit`,
  tokenDecimalInput: `${importTokenFormSelector} #custom-decimals`,
  addCustomTokenButton: `[data-testid="page-container-footer-next"]`,
  confirmImportTokenContent: '.confirm-import-token',
  importTokensButton: `.btn-primary`,
};

const assetNavigationSelector = '.asset-navigation';
const asset = {
  navigation: assetNavigationSelector,
  backButton: `${assetNavigationSelector} [data-testid="asset__back"]`,
};

module.exports.mainPageElements = {
  networkSwitcher,
  walletOverview,
  tabs,
  activityTab,
  popup,
  tippyTooltip,
  actionableMessage,
  accountMenu,
  optionsMenu,
  connectedSites,
  accountModal,
  importAccount,
  createAccount,
  importToken,
  asset,
};
