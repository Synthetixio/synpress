import { createDataTestSelector } from '../../createDataTestSelector'
import settings from './settings'

const addNewAccountMenu = {
  accountNameInput: `input[placeholder="Name"]`,
  createButton: `button${createDataTestSelector('primary-button')}:has-text("Create")`
}

const renameAccountMenu = {
  saveButton: `button${createDataTestSelector('primary-button')}:has-text("Save")`,
  confirmRenameButton: 'div.editable-label button.mm-button-icon',
  renameInput: '.mm-text-field .mm-box--padding-right-4'
}

const importAccountMenu = {
  networkOpenMenu: '#button--listbox-input--1',
  ethereumNetwork: `[data-label="Ethereum"]`,
  baseNetwork: `[data-label="Base"]`,
  polygonNetwork: `[data-label="Polygon"]`,
  bitcoinNetwork: `[data-label="Bitcoin"]`,
  nameInput: `input[name="name"]`,
  privateKeyInput: `textarea[placeholder="Private key"]`,
  importButton: `button:has-text("Import")`,
  error: `textarea[placeholder="Private key"] + div`
}

const addAccountMenu = {
  addAccountButton: createDataTestSelector('sidebar_menu-button-add_account'),
  createNewAccountButton: createDataTestSelector('add-account-create-new-wallet-button'),
  importAccountPrivateKeyButton: 'text=Import Private Key',
  addNewAccountMenu,
  importAccountMenu
}

const editAccountMenu = {
  accountNameButton: `button:has-text("Account Name")`
}

const accountMenu = {
  accountName: createDataTestSelector('home-header-account-name'),
  accountButton: createDataTestSelector('settings-menu-open-button'),
  accountNames: '#accounts button > div:nth-child(2)',
  manageAccountsButton: createDataTestSelector('sidebar_menu-button-manage_accounts'),
  settings: createDataTestSelector('sidebar_menu-button-settings'),
  addAccountMenu,
  renameAccountMenu
}

const manageAccountButton = (accountName: string) =>
  `[role="button"][data-testid="manage-accounts-sortable-${accountName}"]`

const threeDotsMenu = {
  threeDotsButton: createDataTestSelector('account-options-menu-button'),
  settingsButton: createDataTestSelector('global-menu-settings'),
  lockButton: createDataTestSelector('global-menu-lock'),
  accountDetailsButton: createDataTestSelector('account-list-menu-details'),
  accountDetailsCloseButton: '.mm-modal-content .mm-modal-header button.mm-button-icon.mm-button-icon--size-sm'
}

const popoverContainer = '.popover-container'
const popover = {
  closeButton: `${popoverContainer} ${createDataTestSelector('popover-close')}`
}

const recoveryPhraseReminder = {
  gotItButton: '.recovery-phrase-reminder button.btn-primary'
}

const networkDropdownContainer = '.multichain-network-list-menu-content-wrapper'
const networkDropdown = {
  dropdownButton: createDataTestSelector('network-display'),
  closeDropdownButton: `${networkDropdownContainer} > section > div:nth-child(1) button`,
  networksList: `${networkDropdownContainer} .multichain-network-list-menu`,
  networks: `${networkDropdownContainer} .multichain-network-list-item p`,
  showTestNetworksToggle: `${networkDropdownContainer} > section > div > label.toggle-button`,
  toggleOff: `${networkDropdownContainer} label.toggle-button.toggle-button--off`,
  toggleOn: `${networkDropdownContainer} label.toggle-button.toggle-button--on`,
  closeNetworkPopupButton:
    '.mm-modal-header button.mm-button-icon.mm-box--color-icon-default.mm-box--background-color-transparent.mm-box--rounded-lg'
}

const tabContainer = '.tabs__content'
const activityTab = {
  activityTabButton: `${createDataTestSelector('home__activity-tab')}`,
  transactionsList: `${tabContainer} .transaction-list__transactions`,
  pendingQueuedTransactions: `${tabContainer} .transaction-list__pending-transactions .transaction-list-item .transaction-status-label--queued`,
  pendingUnapprovedTransactions: `${tabContainer} .transaction-list__pending-transactions .transaction-list-item .transaction-status-label--unapproved`,
  pendingApprovedTransactions: `${tabContainer} .transaction-list__pending-transactions .transaction-list-item .transaction-status-label--pending`,
  completedTransactions: `${tabContainer} .transaction-list__completed-transactions .transaction-list-item`
}

const singleToken = '.multichain-token-list-item'

export default {
  solanaWalletAddress: createDataTestSelector('account-header-chain-solana:101'),
  ethereumWalletAddress: createDataTestSelector('account-header-chain-eip155:1'),
  baseWalletAddress: createDataTestSelector('account-header-chain-eip155:8453'),
  polygonWalletAddress: createDataTestSelector('account-header-chain-eip155:137'),
  bitcoinWalletAddress: createDataTestSelector('account-header-chain-bip122:000000000019d6689c085ae165831e93'),
  copyAccountAddressButton: createDataTestSelector('address-copy-button-text'),
  currentNetwork: `${createDataTestSelector('network-display')} span:nth-of-type(1)`,
  headerBackButton: createDataTestSelector('header--back'),
  threeDotsMenu,
  settings,
  activityTab,
  networkDropdown,
  accountMenu,
  editAccountMenu,
  recoveryPhraseReminder,
  popover,
  portfolio: {
    singleToken
  },
  manageAccountButton
}
