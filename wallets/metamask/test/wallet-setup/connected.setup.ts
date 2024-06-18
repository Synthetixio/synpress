import { defineWalletSetup } from '@synthetixio/synpress-utils'
import { MetaMask, getExtensionId } from '../../src'
import type { BrowserContext, Page } from '@playwright/test'

const SEED_PHRASE = 'test test test test test test test test test test test junk'

const PASSWORD = 'Tester@1234'

const connectedSetup = defineWalletSetup(PASSWORD, async (context: BrowserContext, walletPage: Page) => {
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

export default connectedSetup