import settings from './settings'

const addNewAccountMenu = {
  accountNameInput: `input[placeholder="Name"]`
}

const importAccountMenu = {
  nameInput: 'input[name="name"]',
  privateKeyInput: 'input[name="privateKey"]',
  importButton: 'button:has-text("Submit")',
  error: 'textarea[placeholder="Private key"] + div'
}

const addAccountMenu = {
  addAccountButton: "button[type='submit']:has-text('Add Account')",
  createNewAccountButton: "button:has-text('Create new account')",
  createButton: "button[type='submit']:has-text('Create')",
  doneButton: "button[type='button']:has-text('Done')",
  showPhraseAgainButton: "button[type='button']:has-text('Show phrase again')",
  importAccountPrivateKeyButton: 'text=Import Private Key',
  importAccountMnemonicButton: 'text=Import mnemonic',
  addNewAccountMenu,
  importAccountMenu
}

const editAccountMenu = {
  accountNameButton: 'button:has-text("Account Name")'
}

const accountMenu = {
  accountName: 'button > div.css-1sigv9r',
  accountNames: 'div.css-1eg4ank > div.css-dd0s7k p.css-3g7plq',
  accountAddresses: 'div.css-1eg4ank > div.css-dd0s7k p.css-89mcmc',
  activeAddress: 'p.css-89mcmc',
  activeAccountName: 'div.css-1eg4ank > div.css-dd0s7k:has(> *:nth-child(3))',
  addAccountMenu
}

export default {
  headerBackButton: `button[aria-label="back"]`,
  switchToMainnetHeaderButton: 'button:has-text("Switch to Mainnet")',
  toasts: 'div[role="status"]',
  settings,
  accountMenu,
  editAccountMenu
}
