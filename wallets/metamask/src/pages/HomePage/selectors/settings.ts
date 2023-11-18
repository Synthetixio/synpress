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

export default {
  SettingsSidebarMenus,
  sidebarMenu,
  advanced
}
