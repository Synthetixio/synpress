import { createDataTestSelector } from '../../createDataTestSelector'

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
  developerSettingsButton: 'button:has-text("Developer Settings")',
  closeSettingsButton: createDataTestSelector('settings-menu-close-button'),

  devSettings,
  securityAndPrivacy
}
