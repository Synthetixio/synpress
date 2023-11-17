import { createDataTestSelector } from '../../../utils/selectors/createDataTestSelector'

const container = '.account-menu'
const accountMenu = {
  accountMenuButton: createDataTestSelector('account-menu-icon'),
  lockButton: `${container} .account-menu__lock-button`,
  importAccountButton: `${container} > .account-menu__item--clickable:nth-of-type(2)`,
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

export default {
  logo: createDataTestSelector('app-header-logo'),
  account: createDataTestSelector('selected-account-click'),
  accountMenu,
  importAccountScreen,
  recoveryPhraseReminder
}
