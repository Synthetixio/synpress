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
  accountButton: number =>
    `[data-testid="account-menu"] [data-testid="tooltip_interactive-wrapper"]:nth-child(${number})`,
};

const settingsMenu = {
  settingsMenuButton: '[data-testid="settings-menu-open-button"]',
  settingsSidebarButton: '[data-testid="sidebar_menu-button-settings"]',
  settingsSidebarCloseButton: '[data-testid="settings-menu-close-button"]',
  settingsPreferencesButton: '[data-testid="settings-item-preferences"]',
  experimentalSettingsRow:
    '[data-testid="settings-item-experimental-features"]',
  trustedAppsRow: '[data-testid="settings-item-trusted-apps"]',
  developerSettingsRow: '[data-testid="settings-item-developer-settings"]',
  defaultAppWalletRow: '[data-testid="settings-item-metamask-override"]',
};
const whatsNew = {
  header: '[data-testid="whats_new-header"]',
  continueButton: '[data-testid="whats_new-continue_button"]',
};

const welcome = {
  takeTheTourButton: '[data-testid="welcome-take_the_tour"]',
  takeTheTourButtonNext: '[data-testid="primary-button"]',
  finishSetup: ['data-testid="onboarding-form-submit-button"'],
};

const accountBar = {
  title: '[data-testid="home-header-account-name"]',
  ethRow: '[data-testid="account-header-chain-eip155:1"]',
  solanaRow: '[data-testid="account-header-chain-solana:101"]',
};

const defaultWallet = {
  metamask: '[data-testid="metamask-override--USE_METAMASK"]',
  phantom: '[data-testid="metamask-override--USE_PHANTOM"]',
  always_ask: '[data-testid="metamask-override--ALWAYS_ASK"]',
};

const connectedSites = {
  trustedAppsRevokeButton: '[data-testid="trusted-apps-revoke-button"]',
  trustedAppsBackButton: '[data-testid="header--back"]',
  rowButton: '[data-testid="trusted_apps_row-button"]',
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
  accountBar,
  settingsMenu,
  connectedSites,
  accountModal,
  importAccount,
  createAccount,
  importToken,
  asset,
  whatsNew,
  welcome,
  defaultWallet,
};
