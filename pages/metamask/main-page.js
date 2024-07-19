const networkSwitcherButtonSelector = '[data-testid="network-display"]';
const networkSwitcher = {
  button: networkSwitcherButtonSelector,
  networkName: `${networkSwitcherButtonSelector} .mm-text--ellipsis`,
  dropdownMenu: '[data-testid="network-droppo"]',
  dropdownMenuItem: `.multichain-network-list-menu-content-wrapper__dialog`,
  mainnetNetworkItem: `.multichain-network-list-menu-content-wrapper__dialog [data-testid="Ethereum Mainnet"]`,
  goerliNetworkItem: `[data-testid="network-droppo"] [data-testid="goerli-network-item"]`,
  sepoliaNetworkItem: `.multichain-network-list-menu-content-wrapper__dialog [data-testid="Sepolia"]`,
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
const completedTransaction = txIndex =>
  `${completedTransactionsList} > div:nth-child(${txIndex + 1})`;
const activityTab = {
  transactionList,
  pendingTransactionsList,
  completedTransactionsList,
  completedTransaction,
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
  button: '[data-testid="account-menu-icon"]',
  accountButton: number =>
    `.multichain-account-menu-popover__list--menu-item:nth-child(${number})`,
  accountName: '.multichain-account-menu-popover__list',
  createAccountButton: '.account-menu__item--clickable:nth-child(6)',
  importAccountButton: '.account-menu__item--clickable:nth-child(7)',
  settingsButton: '.account-menu__item--clickable:nth-child(11)',
  addAccountButton:
    '[data-testid="multichain-account-menu-popover-action-button"]',
  addNewAccountButton:
    '[data-testid="multichain-account-menu-popover-add-account"]',
};

const optionsMenu = {
  button: '[data-testid=account-options-menu-button]',
  accountDetailsButton: '[data-testid="account-list-menu-details"]',
  connectedSitesButton: '[data-testid="global-menu-connected-sites"]',
};

const connectedSitesSelector = '.connected-sites';
const connectedSites = {
  modal: connectedSitesSelector,
  disconnectLabel: `${connectedSitesSelector} .connected-sites-list__content-row-link-button`,
  cancelButton: `${connectedSitesSelector} .btn-secondary`,
  disconnectButton: `${connectedSitesSelector} .btn-primary`,
  closeButton: `${connectedSitesSelector} [data-testid="popover-close"]`,
};

const accountModalSelector = '.mm-modal-content__dialog';

const accountModal = {
  walletAddressInput: `${accountModalSelector} [data-testid="address-copy-button-text"]`,
  closeButton: `${accountModalSelector} .mm-button-icon[aria-label="Close"]`,
  primaryButton: `${accountModalSelector} button.mm-button-primary`,
};

const renameAccountModalSelector = '[data-testid="account-details-modal"]';
const renameAccount = {
  invokeInput: `${renameAccountModalSelector} [data-testid="editable-label-button"]`,
  input: `${renameAccountModalSelector} [data-testid="editable-input"] input`,
  confirmButton: `${renameAccountModalSelector} .mm-modal-body .mm-box--color-icon-default`,
  error: `${renameAccountModalSelector} [data-testid="editable-input"] p.mm-text`,
};

const importAccountSelector = '.multichain-account-menu-popover__dialog';
const importAccount = {
  page: importAccountSelector,
  input: `${importAccountSelector} #private-key-box`,
  cancelButton: `${importAccountSelector} .mm-button-secondary`,
  importButton: `${importAccountSelector} [data-testid="import-account-confirm-button"]`,
};

const createAccount = {
  page: importAccountSelector,
  input: `${importAccountSelector} #account-name`,
  cancelButton: `${importAccountSelector} .mm-button-secondary`,
  createButton: `${importAccountSelector} .mm-button-primary`,
  createAccountError: `${importAccountSelector} .mm-form-text-field__help-text`,
};

const importTokenFormSelector = '.import-tokens-modal__modal-dialog-content';
const importToken = {
  form: importTokenFormSelector,
  tokenTab: '[data-testid="home__asset-tab"]',
  button: '[data-testid="import-token-button"]',
  tokenContractAddressInput: `${importTokenFormSelector} [data-testid="import-tokens-modal-custom-address"]`,
  tokenSymbolInput: `${importTokenFormSelector} [data-testid="import-tokens-modal-custom-symbol"]`,
  tokenEditButton: `${importTokenFormSelector} .import-token__custom-symbol__edit`,
  tokenDecimalInput: `${importTokenFormSelector} [data-testid="import-tokens-modal-custom-decimals"]`,
  addCustomTokenButton: `[data-testid="import-tokens-button-next"]`,
  confirmImportTokenContent:
    '[data-testid="import-tokens-modal-import-button"]',
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
  renameAccount,
  importAccount,
  createAccount,
  importToken,
  asset,
};
