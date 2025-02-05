import { createDataTestSelector } from '../../createDataTestSelector'

const menuOption = '.settings-page__content__tabs .tab-bar .tab-bar__tab'

const settings = {
  menuOption,
  advancedSettings: `${menuOption}:nth-child(2)`,
  ethSignToggle: `${createDataTestSelector('advanced-setting-toggle-ethsign')} .eth-sign-toggle`,
  ethSignWarning:
    '.settings-page__content-row .mm-banner-alert.mm-banner-alert--severity-danger.mm-box--background-color-error-muted'
}

const confirmationModal = {
  confirmationCheckbox: createDataTestSelector('eth-sign__checkbox'),
  continueButton: '.modal__content button.mm-button-primary',
  manualConfirmationInput: '#enter-eth-sign-text',
  enableButton: '.modal__content button.mm-button-primary.mm-button-primary--type-danger'
}

export default {
  settings,
  confirmationModal
}
