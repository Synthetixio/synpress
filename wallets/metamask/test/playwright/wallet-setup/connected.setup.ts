import { defineWalletSetup } from '@synthetixio/synpress-cache'
import { MetaMask, getExtensionId } from '../../../src/playwright'

const SEED_PHRASE = 'test test test test test test test test test test test junk'

const PASSWORD = 'Tester@1234'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, 'MetaMask')

  const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId)

  await metamask.importWallet(SEED_PHRASE)

  await metamask.openSettings()

  const SidebarMenus = metamask.homePage.selectors.settings.SettingsSidebarMenus
  await metamask.openSidebarMenu(SidebarMenus.Advanced)

  await metamask.toggleDismissSecretRecoveryPhraseReminder()

  const page = await context.newPage()

  await page.goto('http://localhost:9999')

  await page.locator('#connectButton').click()

  await metamask.connectToDapp()

  await page.close()
})
