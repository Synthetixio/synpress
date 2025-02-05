import { createDataTestSelector } from '../../createDataTestSelector'

const advanced = {
  showTestNetworksToggle: `${createDataTestSelector('advanced-setting-show-testnet-conversion')} .toggle-button`,
  dismissSecretRecoveryPhraseReminderToggle: '.settings-page__content-row:nth-of-type(11) .toggle-button'
}

const devSettings = {
  toggleTestnetMode: createDataTestSelector('toggleTestNetwork'),
  toggleEnableCopyTransaction: createDataTestSelector('solana-copy-transaction')
}

const securityAndPrivacy = {
  resetApp: 'button:has-text("Reset App")'
}

export default {
  securityAndPrivacyButton: createDataTestSelector('settings-item-security-and-privacy'),
  lockWallet: createDataTestSelector('lock-menu-item'),
  unlocWallet: createDataTestSelector('data-testid="unlock-form-submit-button"'),
  developerSettingsButton: createDataTestSelector('settings-item-developer-settings'),
  closeSettingsButton: createDataTestSelector('settings-menu-close-button'),
  advanced,
  devSettings,
  securityAndPrivacy
}
