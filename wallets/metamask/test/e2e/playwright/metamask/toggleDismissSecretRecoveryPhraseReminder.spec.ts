import { testWithSynpress } from '@synthetixio/synpress-fixtures'
import { MetaMask, unlockForFixture } from '../../../../src'

import Selectors from '../../../../src/pages/HomePage/selectors'
import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, unlockForFixture)

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
