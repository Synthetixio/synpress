import { createDataTestSelector } from '../../createDataTestSelector'

export enum SettingsSidebarMenus {
  General = 1,
  Advanced = 2

  /// ---- Unused Selectors ----
  // Contacts = 3,
  // SecurityAndPrivacy = 4,
  // Alerts = 5,
  // Networks = 6,
  // Experimental = 7,
  // About = 8
}
const sidebarMenu = (menu: SettingsSidebarMenus) =>
  `.settings-page__content__tabs .tab-bar__tab.pointer:nth-of-type(${menu})`

const resetAccount = {
  button: `${createDataTestSelector('advanced-setting-reset-account')} button`,
  confirmButton: '.modal .modal-container__footer button.btn-danger-primary'
}

const advanced = {
  // locator(showTestNetworksToggle).nth(0) -> Show conversion on test networks
  // locator(showTestNetworksToggle).nth(1) -> Show test networks
  resetAccount,
  showTestNetworksToggle: `${createDataTestSelector('advanced-setting-show-testnet-conversion')} .toggle-button`,
  dismissSecretRecoveryPhraseReminderToggle: '.settings-page__content-row:nth-of-type(11) .toggle-button'
}

const newNetworkFormContainer = '.networks-tab__add-network-form'
const newNetworkForm = {
  networkNameInput: `${newNetworkFormContainer} .form-field:nth-child(1) input`,
  rpcUrlInput: `${newNetworkFormContainer} .form-field:nth-child(2) input`,
  rpcUrlError: `${newNetworkFormContainer} .form-field:nth-child(2) .form-field__error`,
  chainIdInput: `${newNetworkFormContainer} .form-field:nth-child(3) input`,
  chainIdError: `${newNetworkFormContainer} .form-field:nth-child(3) .form-field__error`,
  symbolInput: `${createDataTestSelector('network-form-ticker')} input`,
  symbolError: createDataTestSelector('network-form-ticker-warning'),
  blockExplorerUrlInput: `${newNetworkFormContainer} .form-field:last-child input`,
  saveButton: `${newNetworkFormContainer} .networks-tab__add-network-form-footer button.btn-primary`
}

const networks = {
  addNetworkManuallyButton: `${createDataTestSelector('add-network-manually')}`,
  newNetworkForm
}

export default {
  SettingsSidebarMenus,
  sidebarMenu,
  advanced,
  networks
}
