import { createDataTestSelector } from '../../createDataTestSelector'
import settings from './settings'

const addNewAccountMenu = {
  accountNameInput: `input[placeholder="Name"]`,
  createButton: `button${createDataTestSelector('primary-button')}:has-text("Create")`
}

const renameAccountMenu = {
  saveButton: `button${createDataTestSelector('primary-button')}:has-text("Save")`
}

const importAccountMenu = {
  networkOpenMenu: '[aria-haspopup="listbox"][role="button"]:has-text("Solana")',
  ethereumNetwork: '[data-label="Ethereum"]',
  baseNetwork: '[data-label="Base"]',
  polygonNetwork: '[data-label="Polygon"]',
  bitcoinNetwork: '[data-label="Bitcoin"]',
  nameInput: 'input[name="name"]',
  privateKeyInput: 'textarea[placeholder="Private key"]',
  importButton: 'button:has-text("Import")',
  error: 'textarea[placeholder="Private key"] + div'
}

const addAccountMenu = {
  addAccountButton: createDataTestSelector('sidebar_menu-button-add_account'),
  createNewAccountButton: createDataTestSelector('add-account-create-new-wallet-button'),
  importAccountPrivateKeyButton: 'text=Import Private Key',
  addNewAccountMenu,
  importAccountMenu
}

const editAccountMenu = {
  accountNameButton: 'button:has-text("Account Name")'
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

export default {
  solanaWalletAddress: createDataTestSelector('account-header-chain-solana:101'),
  ethereumWalletAddress: createDataTestSelector('account-header-chain-eip155:1'),
  baseWalletAddress: createDataTestSelector('account-header-chain-eip155:8453'),
  polygonWalletAddress: createDataTestSelector('account-header-chain-eip155:137'),
  bitcoinWalletAddress: createDataTestSelector('account-header-chain-bip122:000000000019d6689c085ae165831e93'),
  copyAccountAddressButton: createDataTestSelector('address-copy-button-text'),
  currentNetwork: `${createDataTestSelector('network-display')} span:nth-of-type(1)`,
  headerBackButton: `section:has-text("Developer Settings") ${createDataTestSelector('header--back')}`,
  settings,
  accountMenu,
  editAccountMenu,
  manageAccountButton
}
