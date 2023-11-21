import { createDataTestSelector } from '../../../utils/selectors/createDataTestSelector'

export enum SettingsSidebarMenus {
  General = 1,
  Advanced = 2,
  Contacts = 3,
  SecurityAndPrivacy = 4,
  Alerts = 5,
  Networks = 6,
  Experimental = 7,
  About = 8
}
const sidebarMenu = (menu: SettingsSidebarMenus) =>
  `.settings-page__content__tabs .tab-bar__tab.pointer:nth-of-type(${menu})`

const advanced = {
  showTestNetworksToggle: `${createDataTestSelector('advanced-setting-show-testnet-conversion')} .toggle-button`
}

const experimental = {
  toggleImprovedTokenAllowanceExperience: '.settings-page__content-item .toggle-button'
}

const newNetworkFormContainer = '.networks-tab__add-network-form'
const newNetworkForm = {
  networkNameInput: `${newNetworkFormContainer} .form-field:nth-child(1) input`,
  rpcUrlInput: `${newNetworkFormContainer} .form-field:nth-child(2) input`,
  rpcUrlError: `${newNetworkFormContainer} .form-field:nth-child(2) .form-field__error`,
  chainIdInput: `${newNetworkFormContainer} .form-field:nth-child(3) input`,
  chainIdError: `${newNetworkFormContainer} .form-field:nth-child(3) .form-field__error`,
  symbolInput: `${newNetworkFormContainer} .form-field:nth-child(4) input`,
  blockExplorerUrlInput: `${newNetworkFormContainer} .form-field:nth-child(5) input`,
  cancelButton: `${newNetworkFormContainer} .networks-tab__add-network-form-footer button.btn-secondary`,
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
  experimental,
  networks
}
