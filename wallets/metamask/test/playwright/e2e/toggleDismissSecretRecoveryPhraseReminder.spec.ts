import { testWithSynpress } from '@synthetixio/synpress-core'
import { MetaMask, metaMaskFixtures } from '../../../src/playwright'

import Selectors from '../../../src/selectors/pages/HomePage'
import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(metaMaskFixtures(basicSetup))

const { expect } = test

test('should toggle the "Dismiss Secret Recovery Phrase backup reminder" option', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword)

  await metamask.openSettings()

  const SidebarMenus = metamask.homePage.selectors.settings.SettingsSidebarMenus
  await metamask.openSidebarMenu(SidebarMenus.Advanced)

  await metamask.toggleDismissSecretRecoveryPhraseReminder()

  // We have to wait for the toggle to be "toggled". This is a hacky workaround, unfortunately.
  await expect(metamaskPage.locator(Selectors.settings.advanced.dismissSecretRecoveryPhraseReminderToggle)).toHaveClass(
    /toggle-button--on/
  )
})
