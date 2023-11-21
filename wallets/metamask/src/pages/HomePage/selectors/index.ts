import { createDataTestSelector } from '../../../utils/selectors/createDataTestSelector'
import settings from './settings'

const container = '.account-menu'
const accountMenu = {
  accountMenuButton: createDataTestSelector('account-menu-icon'),
  lockButton: `${container} .account-menu__lock-button`,
  importAccountButton: `${container} > .account-menu__item--clickable:nth-of-type(2)`,
  settingsButton: `${container} > .account-menu__item--clickable:nth-of-type(5)`,
  accountNamesSelector: `${container} ${createDataTestSelector('account-menu__account')} .account-menu__name`
}

const importAccountScreen = {
  privateKeyInput: 'input#private-key-box',
  importButton: '.new-account-import-form__buttons button.btn-primary',
  error: 'span.error'
}

const recoveryPhraseReminder = {
  gotItButton: '.recovery-phrase-reminder button.btn-primary'
}

const networkDropdown = {
  dropdownButton: createDataTestSelector('network-display'),
  networks: `${createDataTestSelector('network-droppo')} .network-dropdown-list li > span`,
  addNetworkButton: `${createDataTestSelector('network-droppo')} .network__add-network-button > button`
}

const tabContainer = '.tabs__content'
const activityTab = {
  activityTabButton: `${createDataTestSelector('home__activity-tab')}`,
  transactionsList: `${tabContainer} .transaction-list__transactions`,
  pendingTransactionsList: `${tabContainer} .transaction-list__pending-transactions`,
  pendingTransactions: `${tabContainer} .transaction-list__pending-transactions .transaction-list-item`,
  pendingQueuedTransactions: `${tabContainer} .transaction-list__pending-transactions .transaction-list-item .transaction-status-label--queued`,
  pendingUnapprovedTransactions: `${tabContainer} .transaction-list__pending-transactions .transaction-list-item .transaction-status-label--unapproved`,
  pendingApprovedTransactions: `${tabContainer} .transaction-list__pending-transactions .transaction-list-item .transaction-status-label--pending`,
  completedTransactionsList: `${tabContainer} .transaction-list__completed-transactions`,
  completedTransactions: `${tabContainer} .transaction-list__completed-transactions .transaction-list-item`
}

export default {
  logo: createDataTestSelector('app-header-logo'),
  account: createDataTestSelector('selected-account-click'),
  currentNetwork: createDataTestSelector('network-display'),
  settings,
  activityTab,
  networkDropdown,
  accountMenu,
  importAccountScreen,
  recoveryPhraseReminder
}
