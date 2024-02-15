import { createDataTestSelector } from '../../../utils/selectors/createDataTestSelector'
import settings from './settings'

const accountMenuContainer = '.multichain-account-menu-popover'

const addNewAccountMenu = {
  accountNameInput: `${accountMenuContainer} input`,
  createButton: `${accountMenuContainer} button.mm-button-primary`
}

const importAccountMenu = {
  privateKeyInput: `${accountMenuContainer} input#private-key-box`,
  importButton: `${accountMenuContainer} ${createDataTestSelector('import-account-confirm-button')}`,
  error: `${accountMenuContainer} p.mm-form-text-field__help-text`
}

const addAccountMenu = {
  addAccountButton: `${accountMenuContainer} ${createDataTestSelector(
    'multichain-account-menu-popover-action-button'
  )}`,
  addNewAccountButton: `${accountMenuContainer} ${createDataTestSelector(
    'multichain-account-menu-popover-add-account'
  )}`,
  importAccountButton: `${accountMenuContainer} div.mm-box.mm-box--padding-4:nth-child(2) > div.mm-box:nth-child(2) > button`,
  addNewAccountMenu,
  importAccountMenu
}

const accountMenu = {
  accountButton: createDataTestSelector('account-menu-icon'),
  accountNames: `${accountMenuContainer} .multichain-account-menu-popover__list .multichain-account-list-item__account-name__button`,
  addAccountMenu
}

const threeDotsMenu = {
  threeDotsButton: createDataTestSelector('account-options-menu-button'),
  settingsButton: createDataTestSelector('global-menu-settings'),
  lockButton: createDataTestSelector('global-menu-lock')
}

const popoverContainer = '.popover-container'
const popover = {
  closeButton: `${popoverContainer} ${createDataTestSelector('popover-close')}`
}

const networkAddedPopover = {
  switchToNetworkButton: '.home__new-network-added button.btn-primary',
  dismissButton: '.home__new-network-added button.btn-secondary'
}

const newNetworkInfoPopover = {
  gotItButton: '.new-network-info__wrapper button.btn-primary'
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
  addNetworkButton: `${networkDropdownContainer} div.mm-box.mm-box--padding-4 > button`,
  toggleOff: `${networkDropdownContainer} label.toggle-button.toggle-button--off`,
  toggleOn: `${networkDropdownContainer} label.toggle-button.toggle-button--on`
}

const tabContainer = '.tabs__content'
const activityTab = {
  activityTabButton: `${createDataTestSelector('home__activity-tab')}`,
  transactionsList: `${tabContainer} .transaction-list__transactions`,
  pendingQueuedTransactions: `${tabContainer} .transaction-list__pending-transactions .transaction-list-item .transaction-status-label--queued`,
  pendingUnapprovedTransactions: `${tabContainer} .transaction-list__pending-transactions .transaction-list-item .transaction-status-label--unapproved`,
  pendingApprovedTransactions: `${tabContainer} .transaction-list__pending-transactions .transaction-list-item .transaction-status-label--pending`,
  completedTransactions: `${tabContainer} .transaction-list__completed-transactions .transaction-list-item`

  /// ---- Unused Selectors ----
  // pendingTransactionsList: `${tabContainer} .transaction-list__pending-transactions`,
  // pendingTransactions: `${tabContainer} .transaction-list__pending-transactions .transaction-list-item`,
  // completedTransactionsList: `${tabContainer} .transaction-list__completed-transactions`,
}

export default {
  logo: `button${createDataTestSelector('app-header-logo')}`,
  copyAccountAddressButton: createDataTestSelector('address-copy-button-text'),
  currentNetwork: `${createDataTestSelector('network-display')} span:nth-of-type(1)`,
  threeDotsMenu,
  settings,
  activityTab,
  networkDropdown,
  accountMenu,
  recoveryPhraseReminder,
  popover,
  networkAddedPopover,
  newNetworkInfoPopover
}
