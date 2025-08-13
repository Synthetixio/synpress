const securityAndPrivacy = {
  resetApp: 'a[href="/settings/security_privacy"]'
}

export default {
  lockWallet: 'a:has-text("Lock wallet")',
  developerSettingsButton: 'button:has-text("Developer Settings")',
  settingsButton: '[aria-label="Account Settings"]',
  networkSettings: 'a[href="/settings/network"]',
  testnetButton: 'label p.css-avjjns:has-text("Testnet")',
  mainnetButton: 'label p.css-avjjns:has-text("Mainnet")',
  devnetButton: 'label p.css-avjjns:has-text("Devnet")',
  securityAndPrivacy
}
