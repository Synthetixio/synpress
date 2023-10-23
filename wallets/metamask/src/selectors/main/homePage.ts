import { createDataTestSelector } from '../../utils/selectors/createDataTestSelector'

const container = '.account-menu'
const accountMenu = {
  accountMenuButton: createDataTestSelector('account-menu-icon'),
  lockButton: `${container} .account-menu__lock-button`
}

export default {
  logo: createDataTestSelector('app-header-logo'),
  accountMenu
}
